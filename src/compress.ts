import { PDFDocument } from 'pdf-lib';
import * as pdfjsLib from 'pdfjs-dist';
import pdfjsWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorkerUrl;

export interface CompressionProgress {
  phase: 'inspecting' | 'step-a' | 'step-b' | 'assembling';
  message: string;
  currentPage?: number;
  totalPages?: number;
  percent: number;
}

export interface CompressionResult {
  bytes: Uint8Array;
  originalSize: number;
  newSize: number;
  targetSize: number;
  pageCount: number;
  reachedTarget: boolean;
  method: 'step-a-lossless' | 'step-b-raster';
  textSelectable: boolean;
  scaleUsed?: number;
  qualityUsed?: number;
}

const SCALE_STEPS = [1.5, 1.25, 1.0, 0.8, 0.65, 0.5];
const SAFETY_MARGIN = 0.97;

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  const mb = kb / 1024;
  return `${mb.toFixed(2)} MB`;
}

export async function inspectPdf(file: File): Promise<{ pageCount: number; size: number }> {
  const buffer = await file.arrayBuffer();
  try {
    const doc = await PDFDocument.load(buffer, { ignoreEncryption: false });
    return { pageCount: doc.getPageCount(), size: file.size };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/encrypt/i.test(msg)) {
      throw new Error('This PDF is password-protected or encrypted. Unlock it first before compressing.');
    }
    throw new Error('Could not read this PDF. The file may be corrupted or not a valid PDF document.');
  }
}

async function renderAllPagesToCanvases(
  pdfData: Uint8Array,
  scale: number,
  grayscale: boolean,
  onProgress?: (p: CompressionProgress) => void
): Promise<{ canvases: HTMLCanvasElement[]; pageDimensions: Array<{ width: number; height: number }> }> {
  const loadingTask = pdfjsLib.getDocument({
    data: pdfData.slice(),
    useWorkerFetch: false,
    isEvalSupported: false
  });

  const pdf = await loadingTask.promise;
  const totalPages = pdf.numPages;
  const canvases: HTMLCanvasElement[] = [];
  const pageDimensions: Array<{ width: number; height: number }> = [];

  for (let i = 1; i <= totalPages; i++) {
    onProgress?.({
      phase: 'step-b',
      message: `Rendering page ${i} of ${totalPages} at ${Math.round(scale * 100)}% scale...`,
      currentPage: i,
      totalPages,
      percent: Math.min(85, Math.round((i / totalPages) * 70) + 15)
    });

    const page = await pdf.getPage(i);
    const baseViewport = page.getViewport({ scale: 1.0 });
    pageDimensions.push({ width: baseViewport.width, height: baseViewport.height });

    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width = Math.max(1, Math.floor(viewport.width));
    canvas.height = Math.max(1, Math.floor(viewport.height));

    const ctx = canvas.getContext('2d', { willReadFrequently: grayscale });
    if (!ctx) throw new Error('Browser canvas context is unavailable.');

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    await page.render({ canvasContext: ctx, viewport }).promise;

    if (grayscale) {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const d = imgData.data;
      for (let p = 0; p < d.length; p += 4) {
        const lum = (0.299 * d[p] + 0.587 * d[p + 1] + 0.114 * d[p + 2]) | 0;
        d[p] = lum;
        d[p + 1] = lum;
        d[p + 2] = lum;
      }
      ctx.putImageData(imgData, 0, 0);
    }

    canvases.push(canvas);
    page.cleanup();
  }

  await pdf.destroy();
  return { canvases, pageDimensions };
}

function canvasToJpegBytes(canvas: HTMLCanvasElement, quality: number): Promise<Uint8Array> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      async (blob) => {
        if (!blob) {
          reject(new Error('Failed to encode page image.'));
          return;
        }
        const buf = await blob.arrayBuffer();
        resolve(new Uint8Array(buf));
      },
      'image/jpeg',
      quality
    );
  });
}

async function buildPdfFromCanvases(
  canvases: HTMLCanvasElement[],
  pageDimensions: Array<{ width: number; height: number }>,
  quality: number
): Promise<Uint8Array> {
  const outDoc = await PDFDocument.create();
  for (let i = 0; i < canvases.length; i++) {
    const jpgBytes = await canvasToJpegBytes(canvases[i], quality);
    const jpgImage = await outDoc.embedJpg(jpgBytes);
    const { width, height } = pageDimensions[i];
    const page = outDoc.addPage([width, height]);
    page.drawImage(jpgImage, { x: 0, y: 0, width, height });
  }
  return await outDoc.save({ useObjectStreams: true });
}

export async function compressPdfToTarget(
  file: File,
  targetBytes: number,
  options: { grayscale: boolean },
  onProgress?: (p: CompressionProgress) => void
): Promise<CompressionResult> {
  if (targetBytes < 5 * 1024) {
    throw new Error('Please choose a target size of at least 5 KB.');
  }

  const originalSize = file.size;
  const rawBuffer = await file.arrayBuffer();
  const rawBytes = new Uint8Array(rawBuffer);

  onProgress?.({
    phase: 'inspecting',
    message: 'Inspecting PDF structure and page count...',
    percent: 5
  });

  let srcDoc: PDFDocument;
  try {
    srcDoc = await PDFDocument.load(rawBytes, { ignoreEncryption: false });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/encrypt/i.test(msg)) {
      throw new Error('This PDF is encrypted or password-protected. Please remove the password and try again.');
    }
    throw new Error('Unable to parse PDF file. It may be corrupted or truncated.');
  }

  const pageCount = srcDoc.getPageCount();
  if (pageCount === 0) {
    throw new Error('This PDF has 0 pages.');
  }

  // Step A: Lossless re-save using object streams (keeps selectable vector text)
  onProgress?.({
    phase: 'step-a',
    message: 'Step A: Optimizing PDF object streams losslessly (preserving selectable text)...',
    percent: 12
  });

  const stepABytes = await srcDoc.save({ useObjectStreams: true });
  const effectiveCeiling = Math.floor(targetBytes * SAFETY_MARGIN);

  if (!options.grayscale && stepABytes.byteLength <= targetBytes) {
    onProgress?.({ phase: 'assembling', message: 'Complete! Lossless optimization met your target.', percent: 100 });
    return {
      bytes: stepABytes,
      originalSize,
      newSize: stepABytes.byteLength,
      targetSize: targetBytes,
      pageCount,
      reachedTarget: true,
      method: 'step-a-lossless',
      textSelectable: true
    };
  }

  // Step B: Render pages via pdf.js and binary-search JPEG quality across scale steps
  let smallestBytes: Uint8Array = stepABytes;
  let smallestScale = 1.0;
  let smallestQuality = 0.9;

  for (const scale of SCALE_STEPS) {
    const { canvases, pageDimensions } = await renderAllPagesToCanvases(
      rawBytes,
      scale,
      options.grayscale,
      onProgress
    );

    // Quick lower-bound check at quality = 0.20 before binary searching
    const minCandidate = await buildPdfFromCanvases(canvases, pageDimensions, 0.2);
    if (minCandidate.byteLength < smallestBytes.byteLength) {
      smallestBytes = minCandidate;
      smallestScale = scale;
      smallestQuality = 0.2;
    }

    if (minCandidate.byteLength > effectiveCeiling) {
      // Even lowest JPEG quality at this scale exceeds target; release canvases and step down scale
      canvases.forEach((c) => { c.width = 0; c.height = 0; });
      continue;
    }

    // Binary search JPEG quality between 0.20 and 0.90 for highest visual fidelity under effectiveCeiling
    let low = 0.2;
    let high = 0.9;
    let bestForScale = minCandidate;
    let bestQ = 0.2;

    for (let iter = 0; iter < 6; iter++) {
      const mid = Number(((low + high) / 2).toFixed(3));
      onProgress?.({
        phase: 'assembling',
        message: `Testing quality ${Math.round(mid * 100)}% at ${Math.round(scale * 100)}% scale...`,
        percent: Math.min(96, 86 + iter * 2)
      });

      const candidate = await buildPdfFromCanvases(canvases, pageDimensions, mid);
      if (candidate.byteLength <= effectiveCeiling) {
        bestForScale = candidate;
        bestQ = mid;
        low = mid;
      } else {
        high = mid;
      }
    }

    canvases.forEach((c) => { c.width = 0; c.height = 0; });

    onProgress?.({ phase: 'assembling', message: 'Finalizing compressed PDF...', percent: 100 });
    return {
      bytes: bestForScale,
      originalSize,
      newSize: bestForScale.byteLength,
      targetSize: targetBytes,
      pageCount,
      reachedTarget: bestForScale.byteLength <= targetBytes,
      method: 'step-b-raster',
      textSelectable: false,
      scaleUsed: scale,
      qualityUsed: bestQ
    };
  }

  onProgress?.({ phase: 'assembling', message: 'Finished minimum-size pass.', percent: 100 });
  return {
    bytes: smallestBytes,
    originalSize,
    newSize: smallestBytes.byteLength,
    targetSize: targetBytes,
    pageCount,
    reachedTarget: smallestBytes.byteLength <= targetBytes,
    method: smallestBytes === stepABytes ? 'step-a-lossless' : 'step-b-raster',
    textSelectable: smallestBytes === stepABytes,
    scaleUsed: smallestScale,
    qualityUsed: smallestQuality
  };
}
