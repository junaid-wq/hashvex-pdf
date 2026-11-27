import { compressPdfToTarget, formatBytes, inspectPdf } from './compress';

function initCompressor() {
  const root = document.getElementById('compressor-root');
  if (!root) return;

  const defaultVal = Number(root.dataset.defaultValue || '200');
  const defaultUnit = (root.dataset.defaultUnit === 'MB' ? 'MB' : 'KB') as 'KB' | 'MB';
  const defaultGray = root.dataset.defaultGrayscale === 'true';

  root.innerHTML = `
    <div class="glass-panel">
      <div id="dropzone" class="dropzone" tabindex="0" role="button" aria-label="Select or drop a PDF file to compress">
        <input id="pdf-input" type="file" accept="application/pdf,.pdf" class="hidden" />
        <p class="dropzone-title" id="dropzone-title">Drop your PDF here or click to choose a file</p>
        <p class="dropzone-sub" id="dropzone-sub">Processed 100% locally in your browser — never uploaded to any server</p>
      </div>

      <div id="file-warning" class="banner banner-warn hidden" role="status"></div>

      <div class="controls-grid">
        <div class="field">
          <label for="target-size">Target Maximum Size</label>
          <div class="size-input-group">
            <input id="target-size" class="input" type="number" min="5" step="any" value="${defaultVal}" />
            <select id="target-unit" class="select" aria-label="Size unit">
              <option value="KB" ${defaultUnit === 'KB' ? 'selected' : ''}>KB</option>
              <option value="MB" ${defaultUnit === 'MB' ? 'selected' : ''}>MB</option>
            </select>
          </div>
        </div>

        <div>
          <label class="checkbox-row">
            <input id="grayscale-toggle" type="checkbox" ${defaultGray ? 'checked' : ''} />
            <span>Grayscale (smaller output)</span>
          </label>
        </div>

        <div>
          <button id="compress-btn" class="btn-primary" type="button" disabled>Compress PDF</button>
        </div>
      </div>

      <div id="progress-wrap" class="progress-wrap hidden" aria-live="polite">
        <div class="progress-track"><div id="progress-fill" class="progress-fill"></div></div>
        <div id="progress-label" class="progress-label">Preparing...</div>
      </div>

      <div id="error-banner" class="banner banner-error hidden" role="alert"></div>
      <div id="result-area" class="hidden" aria-live="polite"></div>
    </div>
  `;

  const dropzone = document.getElementById('dropzone')!;
  const fileInput = document.getElementById('pdf-input') as HTMLInputElement;
  const dropTitle = document.getElementById('dropzone-title')!;
  const dropSub = document.getElementById('dropzone-sub')!;
  const fileWarning = document.getElementById('file-warning')!;
  const targetSizeInput = document.getElementById('target-size') as HTMLInputElement;
  const targetUnitSelect = document.getElementById('target-unit') as HTMLSelectElement;
  const grayscaleToggle = document.getElementById('grayscale-toggle') as HTMLInputElement;
  const compressBtn = document.getElementById('compress-btn') as HTMLButtonElement;
  const progressWrap = document.getElementById('progress-wrap')!;
  const progressFill = document.getElementById('progress-fill')!;
  const progressLabel = document.getElementById('progress-label')!;
  const errorBanner = document.getElementById('error-banner')!;
  const resultArea = document.getElementById('result-area')!;

  let selectedFile: File | null = null;
  let activeDownloadUrl: string | null = null;

  function resetFeedback() {
    errorBanner.classList.add('hidden');
    errorBanner.textContent = '';
    resultArea.classList.add('hidden');
    resultArea.innerHTML = '';
    if (activeDownloadUrl) {
      URL.revokeObjectURL(activeDownloadUrl);
      activeDownloadUrl = null;
    }
  }

  async function handleSelectedFile(file: File | undefined) {
    if (!file) return;
    resetFeedback();
    fileWarning.classList.add('hidden');

    if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
      selectedFile = null;
      compressBtn.disabled = true;
      errorBanner.textContent = 'Please select a valid PDF (.pdf) file.';
      errorBanner.classList.remove('hidden');
      return;
    }

    try {
      const info = await inspectPdf(file);
      selectedFile = file;
      dropTitle.textContent = file.name;
      dropSub.textContent = `${formatBytes(info.size)} · ${info.pageCount} page${info.pageCount === 1 ? '' : 's'} · Ready to compress locally`;
      compressBtn.disabled = false;

      const warnings: string[] = [];
      if (info.pageCount > 50) {
        warnings.push(`This PDF has ${info.pageCount} pages (above 50 pages). Browser rendering may take extra time.`);
      }
      if (info.size > 100 * 1024 * 1024) {
        warnings.push(`This file is ${formatBytes(info.size)} (above 100 MB). Ensure your device has sufficient free RAM.`);
      }
      if (warnings.length > 0) {
        fileWarning.textContent = warnings.join(' ');
        fileWarning.classList.remove('hidden');
      }
    } catch (err: unknown) {
      selectedFile = null;
      compressBtn.disabled = true;
      errorBanner.textContent = err instanceof Error ? err.message : 'Could not read PDF file.';
      errorBanner.classList.remove('hidden');
    }
  }

  dropzone.addEventListener('click', () => fileInput.click());
  dropzone.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      fileInput.click();
    }
  });
  fileInput.addEventListener('change', () => handleSelectedFile(fileInput.files?.[0]));

  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('dragover');
  });
  dropzone.addEventListener('dragleave', () => dropzone.classList.remove('dragover'));
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('dragover');
    handleSelectedFile(e.dataTransfer?.files?.[0]);
  });

  compressBtn.addEventListener('click', async () => {
    if (!selectedFile) return;
    resetFeedback();

    const num = Number(targetSizeInput.value);
    if (!Number.isFinite(num) || num <= 0) {
      errorBanner.textContent = 'Please enter a valid positive target size.';
      errorBanner.classList.remove('hidden');
      return;
    }

    const multiplier = targetUnitSelect.value === 'MB' ? 1024 * 1024 : 1024;
    const targetBytes = Math.round(num * multiplier);

    compressBtn.disabled = true;
    progressWrap.classList.remove('hidden');
    progressFill.style.width = '5%';
    progressLabel.textContent = 'Starting local browser compression...';

    try {
      const res = await compressPdfToTarget(
        selectedFile,
        targetBytes,
        { grayscale: grayscaleToggle.checked },
        (p) => {
          progressFill.style.width = `${p.percent}%`;
          progressLabel.textContent = p.message;
        }
      );

      const blob = new Blob([res.bytes], { type: 'application/pdf' });
      activeDownloadUrl = URL.createObjectURL(blob);
      const baseName = selectedFile.name.replace(/\.pdf$/i, '');
      const outName = `${baseName}-compressed.pdf`;

      const honestyNote = res.textSelectable
        ? 'Text stays selectable (Lossless Step A object-stream optimization).'
        : `Pages became JPEG images (Step B at ${Math.round((res.scaleUsed || 1) * 100)}% scale, ${Math.round((res.qualityUsed || 0.7) * 100)}% quality) to fit your size limit.`;

      const statusBanner = res.reachedTarget
        ? `<div class="banner banner-success"><strong>Target reached!</strong> Your compressed PDF is ${formatBytes(res.newSize)} (under your ${formatBytes(res.targetSize)} limit).</div>`
        : `<div class="banner banner-warn"><strong>Target could not be reached.</strong> The smallest achievable size for this ${res.pageCount}-page file was <strong>${formatBytes(res.newSize)}</strong> (target: ${formatBytes(res.targetSize)}). Try selecting fewer pages, enabling Grayscale, or choosing a larger size limit.</div>`;

      resultArea.innerHTML = `
        ${statusBanner}
        <div class="result-card">
          <div class="stats-row">
            <div class="stat-box">
              <div class="stat-label">Original Size</div>
              <div class="stat-value">${formatBytes(res.originalSize)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">New Size</div>
              <div class="stat-value">${formatBytes(res.newSize)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Text &amp; Format</div>
              <div class="stat-value" style="font-size:0.88rem">${res.textSelectable ? 'Selectable Text' : 'Page Images'}</div>
            </div>
          </div>
          <p style="margin:0 0 1rem;font-size:0.92rem;color:#D6DCEB;">${honestyNote}</p>
          <a href="${activeDownloadUrl}" download="${outName}" class="btn-download">Download ${res.reachedTarget ? 'Compressed PDF' : 'Smallest PDF'} (${formatBytes(res.newSize)})</a>
        </div>
      `;
      resultArea.classList.remove('hidden');
    } catch (err: unknown) {
      errorBanner.textContent = err instanceof Error ? err.message : 'An unexpected compression error occurred.';
      errorBanner.classList.remove('hidden');
    } finally {
      compressBtn.disabled = false;
      progressWrap.classList.add('hidden');
    }
  });
}

initCompressor();
