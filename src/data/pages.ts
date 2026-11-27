export interface FaqItem {
  question: string;
  answer: string;
}

export interface PageConfig {
  slug: string; // "" for root hub
  kind: 'hub' | 'tool' | 'info';
  title: string;
  metaDescription: string;
  h1: string;
  answerFirst: string;
  defaultTargetValue?: number;
  defaultTargetUnit?: 'KB' | 'MB';
  defaultGrayscale?: boolean;
  relatedSlugs: string[];
  faqs: FaqItem[];
  bodyHtml: string;
}

export const PAGES: PageConfig[] = [
  {
    slug: '',
    kind: 'hub',
    title: 'Compress PDF to Any Size Online — Private Browser PDF Compressor | Hashvex PDF',
    metaDescription: 'Compress any PDF to an exact KB or MB target size directly in your browser. Zero file uploads, lossless text preservation first, and adaptive quality search.',
    h1: 'Compress PDF to Any Size in Your Browser',
    answerFirst: 'Select any PDF below, type your exact target file size in KB or MB, and compress it locally in your browser. Hashvex PDF first tries a lossless object-stream pass that keeps your text selectable, and only rasterizes pages if needed to fit your limit—without ever uploading your file to a server.',
    defaultTargetValue: 200,
    defaultTargetUnit: 'KB',
    relatedSlugs: [
      'compress-pdf-under-50kb',
      'compress-pdf-under-100kb',
      'compress-pdf-under-200kb',
      'compress-pdf-under-300kb',
      'compress-pdf-under-500kb',
      'compress-pdf-under-1mb',
      'compress-pdf-under-2mb',
      'reduce-pdf-size-mb-to-kb',
      'compress-scanned-pdf'
    ],
    faqs: [
      {
        question: 'Are my PDF documents uploaded to a server?',
        answer: 'No. Every step runs locally inside your browser using WebAssembly and HTML5 Canvas. Your PDF never leaves your device.'
      },
      {
        question: 'Does compressing a PDF keep my text selectable?',
        answer: 'Yes, whenever possible. Step A re-saves your PDF using compressed object streams without touching fonts or vector text. Only if the file is still larger than your chosen limit does Step B convert pages into optimized JPEG images.'
      },
      {
        question: 'How does the tool hit an exact KB or MB target?',
        answer: 'When rasterization is required, the compressor tests resolution scales from 150% down to 50% and runs a binary search over JPEG quality levels to find the sharpest version that stays safely under 97% of your target size.'
      },
      {
        question: 'What if my PDF cannot reach a very small limit?',
        answer: 'If a multi-page or image-heavy PDF cannot fit under the requested ceiling even at the lowest safe scale, Hashvex PDF tells you honestly, shows the smallest size achieved, and lets you download it or adjust your settings.'
      }
    ],
    bodyHtml: `
      <h2>How Browser-Based Target-Size Compression Works</h2>
      <p>Most online compressors force you to upload sensitive contracts, resumes, or scanned IDs to a remote cloud queue and guess between vague presets like "Low" or "Medium." Hashvex PDF solves both problems in your browser: you set the exact ceiling your upload form demands, and your document stays on your machine from start to finish.</p>
      <h3>Two-Stage Compression Strategy</h3>
      <ul>
        <li><strong>Stage A — Lossless Stream Packing:</strong> Many PDFs exported from Word, Google Docs, or macOS Preview contain uncompressed cross-reference tables and redundant metadata. Re-packing object streams often cuts 15% to 45% off text-heavy files while keeping every word searchable and crisp.</li>
        <li><strong>Stage B — Precision Scale &amp; Quality Search:</strong> When embedded photos or scanner bitmaps keep a file above your limit, the engine renders each page via PDF.js and binary-searches JPEG compression across calibrated scale steps so you get the highest visual clarity that still fits under your limit.</li>
      </ul>
      <h2>Choose a Preset Target Size</h2>
      <p>Need a quick preset for an application portal or email attachment? Jump straight to a dedicated size tool below.</p>
    `
  },
  {
    slug: 'compress-pdf-under-50kb',
    kind: 'tool',
    title: 'Compress PDF Under 50KB Online — Free Browser Tool | Hashvex PDF',
    metaDescription: 'Shrink a 1-page PDF, signature sheet, or lightweight receipt under 50 KB in your browser without uploading files. Honest quality feedback and grayscale option.',
    h1: 'Compress PDF Under 50KB',
    answerFirst: 'Drop your PDF below to compress it under 50 KB directly in your browser. A 50 KB ceiling works best for a single-page text document, receipt, or simple black-and-white certificate—turn on Grayscale if your file contains color backgrounds or stamps.',
    defaultTargetValue: 50,
    defaultTargetUnit: 'KB',
    defaultGrayscale: true,
    relatedSlugs: ['compress-pdf-under-100kb', 'compress-pdf-under-200kb', 'reduce-pdf-size-mb-to-kb'],
    faqs: [
      {
        question: 'Can a multi-page PDF be compressed under 50 KB?',
        answer: 'Usually not cleanly. At 50 KB total, each page in a 5-page document would only get about 9 KB of data, which makes small text blurry. For multi-page files, try 100 KB or 200 KB instead.'
      },
      {
        question: 'Why does Grayscale help reach 50 KB?',
        answer: 'Color scanner noise and tinted backgrounds add extra chrominance data to every block. Switching to grayscale removes color channels so more of your 50 KB budget goes into sharp text edges.'
      },
      {
        question: 'Will my 50 KB PDF still have selectable text?',
        answer: 'If your original 1-page text PDF only needs lossless object-stream optimization to drop below 50 KB, text stays selectable. If it contains embedded images, Step B converts pages to compact JPEGs.'
      },
      {
        question: 'Why is 50 KB a common upload limit?',
        answer: 'Many online forms cap uploads around this size—especially legacy government portals, registration gateways, and profile document slots—so check your form’s instructions before uploading.'
      }
    ],
    bodyHtml: `
      <h2>When a 50 KB PDF Limit Comes Up</h2>
      <p>Fifty kilobytes is one of the tightest document caps you will encounter on the web. Many online forms cap uploads around this size—particularly older administrative portals, scholarship forms, and single-field verification uploads—so check your form's instructions carefully to confirm whether 50 KB is a strict ceiling.</p>
      <h2>What Is Realistic Under 50 KB?</h2>
      <p>Be realistic about page count before you compress. A <strong>1-page text document</strong>, simple invoice, or single-sided black-and-white scan can almost always fit under 50 KB while remaining readable. By contrast, squeezing a <strong>30-page scan</strong> under 50 KB is physically impossible without reducing every page to an unreadable thumbnail—each page would receive less than 1.6 KB of storage.</p>
      <h2>Practical Tips for Hitting 50 KB Cleanly</h2>
      <ul>
        <li><strong>Enable Grayscale:</strong> Checking the Grayscale box strips color channels from stamps, signatures, and off-white paper scans, freeing up bytes for sharper text contrast.</li>
        <li><strong>Trim Extra Pages First:</strong> If only page 1 of a multi-page packet is required, export just that single page before compressing.</li>
        <li><strong>Crop White Margins:</strong> Scanned photos taken on a phone include dark table edges around the paper; cropping tightly to the document improves legibility at lower resolutions.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-100kb',
    kind: 'tool',
    title: 'Compress PDF Under 100KB Online — Fast & Private | Hashvex PDF',
    metaDescription: 'Compress your PDF under 100 KB locally in your browser with zero server uploads. Ideal for 1–2 page resumes, certificates, and application forms.',
    h1: 'Compress PDF Under 100KB',
    answerFirst: 'Upload your PDF below to reduce it under 100 KB locally on your device. A 100 KB budget comfortably fits a 1-to-2 page resume, cover letter, or single-page color certificate while keeping headings and body text sharp.',
    defaultTargetValue: 100,
    defaultTargetUnit: 'KB',
    relatedSlugs: ['compress-pdf-under-50kb', 'compress-pdf-under-200kb', 'compress-pdf-under-300kb', 'reduce-pdf-size-mb-to-kb'],
    faqs: [
      {
        question: 'Is 100 KB enough for a 1-page resume?',
        answer: 'Yes. A standard 1-page text resume frequently stays selectable via lossless Step A compression or renders crisply at high scale under 100 KB.'
      },
      {
        question: 'How many scanned pages can fit under 100 KB?',
        answer: 'Typically 1 to 2 scanned pages remain clear and legible under 100 KB. Beyond 4 or 5 scanned pages, text starts losing sharpness.'
      },
      {
        question: 'Does Hashvex PDF watermark my 100 KB file?',
        answer: 'Never. Your downloaded PDF contains only your own pages—no watermarks, sign-up walls, or tracking scripts.'
      },
      {
        question: 'What happens if my file stops at 115 KB instead of 100 KB?',
        answer: 'Hashvex PDF will never claim success when a file misses the limit. It shows the exact smallest size achieved and suggests enabling Grayscale or removing unneeded pages.'
      }
    ],
    bodyHtml: `
      <h2>Why 100 KB Limits Are So Common</h2>
      <p>One hundred kilobytes is the classic sweet spot for quick web uploads. Many online forms cap uploads around this size—including job application portals, university admission forms, and vendor onboarding workflows—so check your form's instructions to see if 100 KB is your exact ceiling.</p>
      <h2>Realistic Expectations: 1 Page vs. 30 Pages</h2>
      <p>At 100 KB, a <strong>1-page or 2-page document</strong> retains crisp typography and clean line art. Even a single-page full-color certificate exported at high DPI from a design tool usually compresses under 100 KB with zero noticeable artifacts. However, a <strong>30-page scan</strong> cannot realistically fit inside 100 KB because that leaves roughly 3 KB per page—if your form allows larger uploads or separate files, split large packets into individual documents.</p>
      <h2>Tips for Best Results Under 100 KB</h2>
      <ul>
        <li><strong>Keep Text-Based PDFs Clean:</strong> If you exported your document from Word or Google Docs, avoid embedding giant uncompressed PNG logos—Step A will often keep your text 100% selectable under 100 KB.</li>
        <li><strong>Use Grayscale for Phone Scans:</strong> Phone camera scans of paper forms compress 30% to 50% smaller in grayscale without losing readability.</li>
        <li><strong>Verify Before Submitting:</strong> Always open the downloaded PDF at 100% zoom to confirm small numbers, dates, and signatures are easy to read.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-200kb',
    kind: 'tool',
    title: 'Compress PDF Under 200KB Online — No Uploads | Hashvex PDF',
    metaDescription: 'Reduce PDF file size under 200 KB in your browser. Great for 2–5 page documents, bank statements, and scanned forms with private client-side processing.',
    h1: 'Compress PDF Under 200KB',
    answerFirst: 'Select your PDF below to compress it under 200 KB without uploading anything to a server. Two hundred kilobytes provides plenty of headroom for 2-to-5 page resumes, statements, and multi-page forms with clear text.',
    defaultTargetValue: 200,
    defaultTargetUnit: 'KB',
    relatedSlugs: ['compress-pdf-under-100kb', 'compress-pdf-under-300kb', 'compress-pdf-under-500kb', 'reduce-pdf-size-mb-to-kb'],
    faqs: [
      {
        question: 'How many pages look good in a 200 KB PDF?',
        answer: 'A 2-to-4 page scanned document or a 5-to-10 page text-only PDF generally looks sharp and completely readable under 200 KB.'
      },
      {
        question: 'Why did a 3 MB PDF shrink under 200 KB so easily?',
        answer: 'Desktop scanners and phone apps often save raw 300 DPI uncompressed images inside a PDF wrapper. Optimizing resolution and JPEG encoding removes redundant pixel data while keeping text clear.'
      },
      {
        question: 'Can I compress password-protected statements under 200 KB?',
        answer: 'Encrypted PDFs must be unlocked first because browsers cannot legally or technically bypass owner/user encryption keys without your password.'
      },
      {
        question: 'Is there any limit on how many PDFs I can compress?',
        answer: 'No. Because compression runs on your own CPU and RAM rather than our servers, there are no daily quotas or file limits.'
      }
    ],
    bodyHtml: `
      <h2>Why Forms Request PDFs Under 200 KB</h2>
      <p>Two hundred kilobytes strikes a balance between fast server ingestion and legible multi-page records. Many online forms cap uploads around this size when collecting supporting paperwork such as multi-page statements, transcripts, or signed agreements, so check your form's instructions for exact requirements.</p>
      <h2>What Is Realistic at 200 KB?</h2>
      <p>With 200 KB of budget, a <strong>1-page document</strong> will look virtually identical to the original, and even a <strong>3-to-5 page scanned packet</strong> stays sharp enough for small print and tables. If you are trying to compress a <strong>30-page scan</strong> under 200 KB, however, you will hit the visual floor (~6 KB per page)—in that scenario, check whether the portal accepts 500 KB or 1 MB instead.</p>
      <h2>Tips for Clean 200 KB Compression</h2>
      <ul>
        <li><strong>Start in Full Color:</strong> Unlike 50 KB limits, 200 KB usually preserves color logos, blue ink signatures, and highlights cleanly on 1–3 page files.</li>
        <li><strong>Switch to Grayscale for 4+ Pages:</strong> Once a scanned document reaches four or more pages, toggling Grayscale lets the binary search choose a higher resolution scale.</li>
        <li><strong>Check Text Selectability:</strong> Look at the result summary before downloading—if Step A succeeded, your PDF still contains original vector fonts.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-300kb',
    kind: 'tool',
    title: 'Compress PDF Under 300KB Online — Browser PDF Compressor | Hashvex PDF',
    metaDescription: 'Compress PDF files under 300 KB locally in your browser. Ideal for multi-page applications, academic transcripts, and scanned IDs with zero cloud uploads.',
    h1: 'Compress PDF Under 300KB',
    answerFirst: 'Drop your PDF below to fit it cleanly under 300 KB in your browser. A 300 KB limit easily accommodates 3-to-8 page documents, transcripts, and color scans while preserving fine print and signatures.',
    defaultTargetValue: 300,
    defaultTargetUnit: 'KB',
    relatedSlugs: ['compress-pdf-under-200kb', 'compress-pdf-under-500kb', 'compress-pdf-under-1mb', 'compress-scanned-pdf'],
    faqs: [
      {
        question: 'Is 300 KB enough for a multi-page academic transcript or statement?',
        answer: 'Yes. Most 3-to-6 page transcripts and statements compress under 300 KB with crisp, readable grades, dates, and seals.'
      },
      {
        question: 'How does Hashvex PDF pick the right resolution for 300 KB?',
        answer: 'It tries high-resolution scales (up to 150% and 125%) first and only steps down scale if even moderate JPEG compression exceeds 97% of 300 KB.'
      },
      {
        question: 'Does this work offline once the page is loaded?',
        answer: 'Yes. All JavaScript and PDF worker bundles are self-hosted with zero external CDN dependencies, so compression runs entirely on your machine.'
      },
      {
        question: 'Will compressing under 300 KB change my page dimensions?',
        answer: 'No. Every page keeps its exact original width and height in points (such as A4 or US Letter) so printing works normally.'
      }
    ],
    bodyHtml: `
      <h2>Where 300 KB Upload Limits Appear</h2>
      <p>Three hundred kilobytes is a frequent ceiling on document submission portals that expect several pages of proof in a single file. Many online forms cap uploads around this size for multi-page supporting records, so check your form's instructions before preparing your file.</p>
      <h2>1-Page Document vs. 30-Page Scan at 300 KB</h2>
      <p>A <strong>1-to-4 page document</strong> at 300 KB retains high-resolution detail, crisp small print, and clean color graphics. Even a 6-to-8 page mixed document usually fits comfortably. On the other hand, a <strong>30-page scan</strong> averages only 10 KB per page at 300 KB—readable for large headings, but tight for dense tables unless Grayscale is enabled.</p>
      <h2>Practical Tips for 300 KB Files</h2>
      <ul>
        <li><strong>Preserve Color on Short Packets:</strong> For 1 to 4 pages, leave Grayscale unchecked so official stamps and color charts stay intact.</li>
        <li><strong>Use Grayscale for Long Packets:</strong> If your PDF has 8 to 15 pages, Grayscale boosts effective resolution per page noticeably.</li>
        <li><strong>Watch the Step A vs. Step B Indicator:</strong> Text-heavy reports often qualify for lossless Step A compression under 300 KB without any image conversion.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-500kb',
    kind: 'tool',
    title: 'Compress PDF Under 500KB Online — Fast & Private | Hashvex PDF',
    metaDescription: 'Compress large PDFs under 500 KB directly in your browser without uploading files. Great for 5–15 page reports, portfolios, and scanned packets.',
    h1: 'Compress PDF Under 500KB',
    answerFirst: 'Choose a PDF below to compress it under 500 KB locally in your browser. Half a megabyte gives ample room for 5-to-15 page reports, pitch decks, and scanned packets to stay sharp and readable.',
    defaultTargetValue: 500,
    defaultTargetUnit: 'KB',
    relatedSlugs: ['compress-pdf-under-300kb', 'compress-pdf-under-1mb', 'compress-pdf-under-2mb', 'compress-scanned-pdf'],
    faqs: [
      {
        question: 'How many pages fit cleanly under 500 KB?',
        answer: 'A 5-to-12 page scanned document or a 15-to-25 page text-and-chart report typically looks crisp and easy to read under 500 KB.'
      },
      {
        question: 'Why do exported design or presentation PDFs often start at 8 MB?',
        answer: 'Design tools embed full-bleed uncompressed photos and duplicate font subsets on every slide. Re-encoding images to calibrated JPEG quality cuts 90%+ of bloat.'
      },
      {
        question: 'Is 500 KB good for emailing PDFs on mobile data?',
        answer: 'Yes. A 500 KB attachment opens almost instantaneously on cellular connections and never triggers strict corporate inbox filters.'
      },
      {
        question: 'Are large 50+ page PDFs supported?',
        answer: 'Yes, though the tool displays a friendly performance heads-up above 50 pages or 100 MB because rendering dozens of pages in browser memory takes a few extra seconds.'
      }
    ],
    bodyHtml: `
      <h2>Why 500 KB Is a Popular Document Ceiling</h2>
      <p>Half a megabyte (500 KB) is a practical threshold used across HR systems, academic portals, and customer support forms that accept multi-page packets. Many online forms cap uploads around this size to keep storage fast and predictable, so check your form's instructions to confirm your exact limit.</p>
      <h2>Realistic Quality: 1 Page vs. 30 Pages</h2>
      <p>For a <strong>1-to-5 page document</strong>, 500 KB is generous—you will likely get 125% to 150% render scale at high JPEG quality, making charts and fine print look virtually untouched. Even a <strong>30-page scan</strong> becomes realistic around 500 KB (roughly 16 KB per page), especially when Grayscale is turned on for black-and-white text pages.</p>
      <h2>Tips for Compressing Under 500 KB</h2>
      <ul>
        <li><strong>Keep Color Enabled First:</strong> With 500 KB available, most 1-to-8 page PDFs retain full color without sacrificing sharpness.</li>
        <li><strong>Use Grayscale for 20+ Page Scans:</strong> If you are shrinking a thick 25-to-35 page scan under 500 KB, Grayscale keeps small body text legible.</li>
        <li><strong>Check Page Count Warnings:</strong> Above 50 pages, give your browser tab a moment to finish rendering each page cleanly in memory.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-1mb',
    kind: 'tool',
    title: 'Compress PDF Under 1MB Online — Zero Server Uploads | Hashvex PDF',
    metaDescription: 'Shrink multi-megabyte PDFs under 1 MB locally in your browser. Ideal for portfolios, brochures, and 10–30 page scanned documents with high visual clarity.',
    h1: 'Compress PDF Under 1MB',
    answerFirst: 'Select your PDF below to shrink it under 1 MB entirely inside your browser. One megabyte preserves near-original sharpness across 10-to-30 page documents, brochures, and high-resolution scanned packets.',
    defaultTargetValue: 1,
    defaultTargetUnit: 'MB',
    relatedSlugs: ['compress-pdf-under-500kb', 'compress-pdf-under-2mb', 'reduce-pdf-size-mb-to-kb', 'compress-scanned-pdf'],
    faqs: [
      {
        question: 'Can a 20 MB scanned PDF be compressed under 1 MB?',
        answer: 'Yes. Raw phone or flatbed scans often start between 10 MB and 25 MB and routinely compress under 1 MB while keeping text and diagrams crisp.'
      },
      {
        question: 'Will images and charts still look sharp at 1 MB?',
        answer: 'For documents up to 15–20 pages, 1 MB allows high scale and strong JPEG quality, keeping photos, diagrams, and small text clean.'
      },
      {
        question: 'Does Hashvex PDF use 1000 KB or 1024 KB for 1 MB?',
        answer: 'It uses binary 1024 × 1024 bytes (1,048,576 bytes) with a 97% safety margin (~1,017 KB) so your file stays safely below 1 MB on every operating system and server check.'
      },
      {
        question: 'Are my confidential contracts or tax files safe?',
        answer: 'Completely. Processing happens locally in your browser tab—nothing is transmitted over the network.'
      }
    ],
    bodyHtml: `
      <h2>When You Need a PDF Under 1 MB</h2>
      <p>One megabyte is the standard ceiling for web portals, client intake forms, and mobile uploaders that want crisp documents without multi-megabyte bloat. Many online forms cap uploads around this size for multi-page packets, brochures, and portfolios, so check your form's instructions for exact limits.</p>
      <h2>What Is Realistic Under 1 MB?</h2>
      <p>At 1 MB, a <strong>1-page or 5-page document</strong> looks practically lossless even if it contains full-color photography. A <strong>30-page scan</strong> also fits comfortably under 1 MB (around 33 KB per page), giving plenty of clarity for contracts, textbooks, and multi-page applications.</p>
      <h2>Best Practices for 1 MB Compression</h2>
      <ul>
        <li><strong>Leave Color On:</strong> Unless your PDF exceeds 40 pages, 1 MB provides enough data budget to preserve full color fidelity.</li>
        <li><strong>Take Advantage of the 97% Safety Margin:</strong> Because Windows Explorer displays binary MiB while some servers check decimal MB, Hashvex PDF aims for 97% of 1 MB so your file passes both checks.</li>
        <li><strong>Inspect Photo-Heavy Pages:</strong> If a specific page has tiny map labels or dense schematics, verify it after download; if needed, step up to the 2 MB preset.</li>
      </ul>
    `
  },
  {
    slug: 'compress-pdf-under-2mb',
    kind: 'tool',
    title: 'Compress PDF Under 2MB Online — High-Quality Browser Tool | Hashvex PDF',
    metaDescription: 'Compress large PDFs under 2 MB in your browser with no file uploads. Preserves high-resolution graphics, portfolios, and long multi-page documents.',
    h1: 'Compress PDF Under 2MB',
    answerFirst: 'Drop your large PDF below to compress it under 2 MB directly in your browser. Two megabytes retains high-resolution photography, architectural drawings, and 20-to-50 page documents with zero cloud uploads.',
    defaultTargetValue: 2,
    defaultTargetUnit: 'MB',
    relatedSlugs: ['compress-pdf-under-1mb', 'compress-pdf-under-500kb', 'compress-scanned-pdf'],
    faqs: [
      {
        question: 'When should I choose 2 MB instead of 1 MB?',
        answer: 'Choose 2 MB when your PDF has 25+ pages, full-page photographs, product catalogs, or architectural diagrams where extra fine detail matters.'
      },
      {
        question: 'Can a 50 MB PDF fit under 2 MB?',
        answer: 'In most cases, yes. Unoptimized print-ready PDFs or raw camera scans frequently shrink by 90% to 96% without losing screen legibility.'
      },
      {
        question: 'Does processing a 50 MB PDF freeze my browser?',
        answer: 'Hashvex PDF runs PDF parsing inside a dedicated Web Worker and updates progress page by page so your tab stays responsive.'
      },
      {
        question: 'Why is 2 MB a common upload ceiling?',
        answer: 'Many online forms cap uploads around this size—especially default PHP/Nginx web server configurations and grant/application portals—so check your form’s instructions.'
      }
    ],
    bodyHtml: `
      <h2>Why 2 MB Is a Standard Web Server Ceiling</h2>
      <p>Two megabytes is one of the most widespread default upload limits across web servers and content management systems. Many online forms cap uploads around this size when accepting pitch decks, design portfolios, and long multi-page filings, so check your form's instructions to verify your limit.</p>
      <h2>Realistic Quality: 1-Page Brochure vs. 30-Page Scan</h2>
      <p>With 2 MB of space, a <strong>1-to-10 page document</strong> retains crisp 150% render scale and high JPEG quality, keeping subtle gradients, screenshots, and small captions sharp. Even a <strong>30-page scan</strong> gets roughly 65 KB per page—more than enough for clean, comfortable reading on any screen or printer.</p>
      <h2>Tips for 2 MB PDF Optimization</h2>
      <ul>
        <li><strong>Keep Full Color:</strong> Two megabytes gives ample room for full-color brochures, slide decks, and illustrated reports.</li>
        <li><strong>Check Lossless Step A First:</strong> Many 2.5 MB to 3 MB text-and-vector PDFs drop under 2 MB in Step A without rasterizing a single page.</li>
        <li><strong>Watch Large File Notices:</strong> Files over 100 MB or 50 pages work in-browser, though keeping browser tabs lightweight ensures smooth memory allocation.</li>
      </ul>
    `
  },
  {
    slug: 'reduce-pdf-size-mb-to-kb',
    kind: 'tool',
    title: 'Reduce PDF Size from MB to KB Online — Exact KB Target | Hashvex PDF',
    metaDescription: 'Convert a multi-megabyte PDF down to kilobytes (KB) locally in your browser. Set any exact KB limit with zero server uploads and honest quality feedback.',
    h1: 'Reduce PDF Size from MB to KB',
    answerFirst: 'Load your multi-megabyte PDF below, enter your desired kilobyte ceiling (such as 100 KB, 200 KB, or 500 KB), and shrink it from MB to KB locally in your browser. Nothing is uploaded, and you see exact before-and-after sizes before downloading.',
    defaultTargetValue: 150,
    defaultTargetUnit: 'KB',
    relatedSlugs: ['compress-pdf-under-100kb', 'compress-pdf-under-200kb', 'compress-pdf-under-500kb', 'compress-scanned-pdf'],
    faqs: [
      {
        question: 'Why do phone-scanned PDFs start at 5 MB to 15 MB?',
        answer: 'Modern smartphone cameras capture 12 MP to 48 MP photos and embed them uncompressed inside a PDF container. Downscaling to document resolution cuts megabytes down to kilobytes.'
      },
      {
        question: 'What KB target should I pick when shrinking from MB to KB?',
        answer: 'If your form does not specify an exact number, 150 KB to 250 KB is a reliable range for 1–4 page documents, while 500 KB works well for 5–12 pages.'
      },
      {
        question: 'Can every 10 MB PDF shrink into kilobytes?',
        answer: 'A 10 MB file with 1 to 8 pages easily shrinks into kilobytes. A 10 MB file with 80 pages cannot fit under 200 KB legibly—Hashvex PDF will show the smallest realistic size if the target is too tight.'
      },
      {
        question: 'Is my data private when converting MB to KB?',
        answer: 'Yes. All pixel resampling and PDF assembly happen inside your browser’s local memory with zero server uploads.'
      }
    ],
    bodyHtml: `
      <h2>Why PDFs Balloon Into Megabytes</h2>
      <p>It is frustrating to scan a two-page form on your phone or export a simple report and end up with a 6 MB file that gets rejected by an upload form. Most of those megabytes come from oversized 4000-pixel camera images, embedded print color profiles, or bloated export metadata rather than actual document information.</p>
      <h2>How Much Reduction Is Realistic (MB to KB)?</h2>
      <p>Turning a <strong>1-to-3 page multi-megabyte PDF</strong> into a 100 KB–300 KB file is routine and preserves clear, sharp text. However, if you are shrinking a <strong>30-page scan</strong> from 25 MB down into kilobytes, aim for at least 500 KB to 900 KB (and enable Grayscale) so individual pages still have enough pixels to keep text readable.</p>
      <h2>Smart Workflow for MB-to-KB Reduction</h2>
      <ul>
        <li><strong>Start Around 150–250 KB:</strong> For typical 1–3 page forms, 150 KB to 250 KB eliminates upload errors without sacrificing crispness.</li>
        <li><strong>Toggle Grayscale for Paper Scans:</strong> Removing color noise from camera photos regularly cuts file size in half at the same visual sharpness.</li>
        <li><strong>Check Form Rules:</strong> Many online forms cap uploads around a specific KB limit, so check your form's instructions and enter that exact number above.</li>
      </ul>
    `
  },
  {
    slug: 'compress-scanned-pdf',
    kind: 'tool',
    title: 'Compress Scanned PDF Online — Grayscale & Exact Size Control | Hashvex PDF',
    metaDescription: 'Compress heavy scanned PDFs from phone cameras or flatbed scanners to an exact KB or MB size in your browser. Includes one-click Grayscale and zero uploads.',
    h1: 'Compress Scanned PDF in Your Browser',
    answerFirst: 'Drop your scanned PDF below, keep Grayscale checked for maximum clarity per kilobyte, and set your target file size. Hashvex PDF resamples oversized scanner bitmaps locally in your browser without uploading sensitive IDs, receipts, or contracts.',
    defaultTargetValue: 300,
    defaultTargetUnit: 'KB',
    defaultGrayscale: true,
    relatedSlugs: ['reduce-pdf-size-mb-to-kb', 'compress-pdf-under-200kb', 'compress-pdf-under-500kb', 'compress-pdf-under-1mb'],
    faqs: [
      {
        question: 'Why does Step A rarely shrink a scanned PDF?',
        answer: 'Scanned PDFs consist of full-page raster images rather than vector text streams, so lossless object-stream packing cannot shrink the image pixels. Step B automatically steps in to optimize resolution and JPEG compression.'
      },
      {
        question: 'Should I use Grayscale for scanned documents?',
        answer: 'Yes, for almost all text documents, receipts, agreements, and forms. Grayscale eliminates color scanner speckles and allocates your entire byte budget to sharp black-and-white contrast.'
      },
      {
        question: 'Are scanned IDs, passports, and tax returns private here?',
        answer: 'Yes. Because scanned documents often contain sensitive personal data, Hashvex PDF is built to run 100% locally in your browser—zero bytes ever touch a server.'
      },
      {
        question: 'How small can a 30-page scanned PDF realistically get?',
        answer: 'With Grayscale enabled, a 30-page scan usually stays comfortably readable between 500 KB and 1.2 MB (around 17 KB to 40 KB per page).'
      }
    ],
    bodyHtml: `
      <h2>Why Scanned PDFs Are Huge (and Sensitive)</h2>
      <p>Flatbed scanners and mobile scanning apps capture each sheet as a high-resolution photograph, easily producing 1 MB to 4 MB per page. At the same time, scanned PDFs are the exact files you least want to upload to unknown servers—passports, signed leases, medical records, and tax filings.</p>
      <h2>Realistic Targets for Scanned Documents</h2>
      <p>For a <strong>1-page scan</strong>, targets of 50 KB to 150 KB produce clean, readable results. For a <strong>30-page scan</strong>, aim for 500 KB to 1.5 MB so each page retains enough pixel resolution for small print, stamps, and handwritten signatures.</p>
      <h2>Best Settings for Scanned PDFs</h2>
      <ul>
        <li><strong>Use Grayscale Mode:</strong> Grayscale is pre-selected on this page because stripping RGB color channels from paper scans improves text sharpness at any target size.</li>
        <li><strong>Watch the Page Count Notice:</strong> Scans with more than 50 pages will display a quick notice; give the progress bar a few moments as each page renders locally.</li>
        <li><strong>Verify Small Details:</strong> After compression, check dates, serial numbers, and signatures before submitting—many online forms cap uploads around strict limits, so check your form's instructions if you need to adjust your target.</li>
      </ul>
    `
  },
  {
    slug: 'privacy',
    kind: 'info',
    title: 'Privacy Policy — Local Browser Processing | Hashvex PDF',
    metaDescription: 'Hashvex PDF processes all PDF files locally inside your browser. Zero file uploads, zero server storage, and transparent analytics.',
    h1: 'Privacy Policy',
    answerFirst: 'Your PDF files are processed 100% locally inside your web browser and are never uploaded, transmitted, or stored on any server. When you close or refresh the page, all document data in browser memory is immediately cleared.',
    relatedSlugs: ['about', 'contact'],
    faqs: [],
    bodyHtml: `
      <h2>1. Zero File Uploads (Client-Side Architecture)</h2>
      <p>Hashvex PDF (<a href="https://pdf.hashvex.tech/">pdf.hashvex.tech</a>) is engineered as a static, client-side web application. When you select or drag-and-drop a PDF file, your browser reads the file directly from your local storage into memory using standard HTML5 File APIs, <code>pdf-lib</code>, and <code>pdf.js</code>. At no point is your PDF sent over the network to Hashvex or any third party.</p>
      <h2>2. Cookies, Local Storage &amp; Analytics</h2>
      <p>We do not require accounts, logins, or personal information to use the PDF compressor. We may use privacy-preserving, cookieless aggregated traffic metrics (such as Cloudflare Web Analytics) to measure page load speed and overall usage volume without tracking individual users or inspecting file contents.</p>
      <h2>3. Advertising Disclosures</h2>
      <p>To keep this tool free without usage limits, pages may display clearly labeled advertising slots. Any future ad provider integration will be disclosed here with appropriate consent controls where required by law.</p>
      <h2>4. Contact</h2>
      <p>If you have any privacy questions, email <a href="mailto:md.junaid211234@gmail.com">md.junaid211234@gmail.com</a>.</p>
    `
  },
  {
    slug: 'about',
    kind: 'info',
    title: 'About Hashvex PDF — Fast, Honest Browser PDF Compression',
    metaDescription: 'Learn how Hashvex PDF compresses documents to exact KB and MB limits locally in your browser using lossless object streams and adaptive quality search.',
    h1: 'About Hashvex PDF',
    answerFirst: 'Hashvex PDF is a fast, privacy-first browser utility built by Mohammad Junaid as part of the Hashvex developer and productivity tool suite. It was created to solve a simple everyday frustration: shrinking a PDF under a strict KB or MB limit without uploading private documents to remote servers.',
    relatedSlugs: ['privacy', 'contact'],
    faqs: [],
    bodyHtml: `
      <h2>Why We Built Hashvex PDF</h2>
      <p>Most PDF tools force a bad trade-off: either upload sensitive personal documents to a cloud server, or settle for blind compression presets that still miss your upload form's size cap. Hashvex PDF puts the entire compression engine inside your browser tab and targets your exact KB or MB ceiling.</p>
      <h2>Honest Compression Engineering</h2>
      <ul>
        <li><strong>Lossless First:</strong> We always try lossless object-stream optimization (Step A) first so text-based PDFs stay searchable and crisp.</li>
        <li><strong>Calibrated Raster Fallback:</strong> When images or scans require pixel compression (Step B), a binary search finds the highest visual quality under 97% of your limit.</li>
        <li><strong>Clear Transparency:</strong> Before you download, we show the exact original size, new size, and whether text remained selectable or pages were converted to images—and we never claim success if a target cannot be reached.</li>
      </ul>
      <p>Explore more free client-side utilities at <a href="https://hashvex.tech">Hashvex Tech</a>.</p>
    `
  },
  {
    slug: 'contact',
    kind: 'info',
    title: 'Contact Hashvex PDF — Feedback & Support',
    metaDescription: 'Get in touch with the creator of Hashvex PDF for bug reports, feature feedback, or technical inquiries.',
    h1: 'Contact Us',
    answerFirst: 'Have feedback, spotted an edge-case PDF that behaved unexpectedly, or want to suggest a size preset? Reach out directly via email and we will get back to you.',
    relatedSlugs: ['about', 'privacy'],
    faqs: [],
    bodyHtml: `
      <h2>Direct Email Support</h2>
      <p>You can contact Mohammad Junaid directly at <a href="mailto:md.junaid211234@gmail.com">md.junaid211234@gmail.com</a>.</p>
      <h2>Helpful Details to Include for Bug Reports</h2>
      <ul>
        <li>Your browser and operating system (for example, Chrome on Windows or Safari on iOS).</li>
        <li>Approximate file size, page count, and target KB/MB size you selected.</li>
        <li>Whether the PDF was exported from a desktop app or created by a scanner.</li>
      </ul>
      <p><em>Note: Please do not email sensitive personal documents—Hashvex PDF runs locally in your browser so you never need to send files to us.</em></p>
    `
  }
      ,{
    slug: "compress-pdf-for-uscis",
    kind: "preset",
    title: "Compress PDF for USCIS Online Filing (Under 12 MB) — Hashvex PDF",
    metaDescription: "Shrink immigration evidence, forms, and translations under USCIS's strict 12 MB file limit locally in your browser. Zero server uploads for sensitive A-Number documents.",
    h1: "Compress PDF for USCIS Online Filing (Under 12 MB)",
    subtitle: "Meet myUSCIS 12 MB per-file evidence limits without uploading sensitive immigration records, passports, or translations to cloud servers.",
    defaultTargetValue: 11500,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "USCIS • 12 MB Limit",
    summary: "USCIS online filing requires unencrypted PDFs under 12 MB per file with readable stamps and certified translations. Hashvex PDF compresses multi-page immigration packets locally in your browser so sensitive personal records never leave your device.",
    relatedSlugs: ["compress-pdf-for-nvc-ceac", "compress-pdf-for-irs", "compress-pdf-to-1mb", "compress-pdf-to-2mb"],
    faqs: [
      {
        question: "What is the maximum PDF file size for USCIS online filing?",
        answer: "USCIS online accounts allow up to 12 MB per uploaded evidence file in PDF, JPG, JPEG, or TIF/TIFF format. Setting a target around 11.5 MB (11,500 KB) ensures your file stays safely below the 12 MB cap."
      },
      {
        question: "Can I upload password-protected PDFs to USCIS?",
        answer: "No. USCIS rejects encrypted or password-protected PDFs. Unlock bank statements or tax transcripts before compressing and uploading."
      },
      {
        question: "Is it safe to compress USCIS immigration documents online?",
        answer: "Yes on Hashvex PDF because all compression runs 100% locally in your browser—your passport scans, A-Numbers, and translations are never transmitted to any server."
      }
    ]
  },
  {
    slug: "compress-pdf-for-nvc-ceac",
    kind: "preset",
    title: "Compress PDF for NVC CEAC Portal (Under 2 MB) — Hashvex PDF",
    metaDescription: "Compress civil documents, Affidavit of Support (I-864), and tax transcripts under the NVC CEAC 2 MB PDF limit locally in your browser with zero uploads.",
    h1: "Compress PDF for NVC CEAC Portal (Under 2 MB)",
    subtitle: "Fit multi-page civil documents, marriage certificates, and I-864 financial packets under the State Department CEAC 2 MB cap.",
    defaultTargetValue: 1900,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "NVC / CEAC • 2 MB Limit",
    summary: "The Consular Electronic Application Center (CEAC) enforces a strict 2 MB limit per single un-zipped PDF file. Hashvex PDF compresses multi-page visa scans locally while keeping seals and signatures sharp.",
    relatedSlugs: ["compress-pdf-for-uscis", "compress-pdf-for-common-app", "compress-pdf-to-2mb", "compress-pdf-to-1mb"],
    faqs: [
      {
        question: "What is the NVC CEAC file size limit for scanned PDFs?",
        answer: "Each individual document uploaded to CEAC must be 2 MB or smaller in a single un-zipped, unencrypted PDF or JPG file. Targeting 1,900 KB avoids binary/decimal size rejections."
      },
      {
        question: "Can I split a large document into multiple files for CEAC?",
        answer: "No. The National Visa Center requires multi-page documents—including original documents paired with certified English translations—to be combined into one single PDF under 2 MB."
      }
    ]
  },
  {
    slug: "compress-pdf-for-common-app",
    kind: "preset",
    title: "Compress PDF for Common App (Under 2,000 KB / 2 MB) — Hashvex PDF",
    metaDescription: "Shrink SAT/ACT score reports, high school transcripts, and portfolios under Common App's 2,000 KB PDF upload limit locally in seconds.",
    h1: "Compress PDF for Common App (Under 2,000 KB)",
    subtitle: "Reduce College Board score reports, transcripts, and counselor PDFs below Common App's 2,000 KB limit with crisp vector text.",
    defaultTargetValue: 1950,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "Common App • 2,000 KB",
    summary: "Common App enforces a strict 2,000 KB (2 MB) ceiling on uploaded score reports and supporting PDFs. Hashvex PDF first strips bloated PDF metadata losslessly before rasterizing, keeping transcript text sharp.",
    relatedSlugs: ["compress-pdf-to-2mb", "compress-pdf-to-1mb", "compress-pdf-for-nvc-ceac", "compress-pdf-for-gate-neet"],
    faqs: [
      {
        question: "Why does Common App reject my SAT score report PDF?",
        answer: "Official score reports downloaded from College Board frequently exceed Common App's 2,000 KB upload limit. Compressing to 1,950 KB fixes the upload error immediately."
      },
      {
        question: "Will my transcript text stay selectable and clear?",
        answer: "Yes. Step A of Hashvex PDF rewrites compressed object streams without touching fonts or vector text, often shrinking transcripts under 2,000 KB with zero visual change."
      }
    ]
  },
  {
    slug: "compress-pdf-for-irs",
    kind: "preset",
    title: "Compress PDF for IRS Document Upload Tool (Under 15 MB) — Hashvex PDF",
    metaDescription: "Compress tax notice responses, Forms 2848/8821, and supporting receipts under the IRS 15 MB PDF limit locally on your device—zero cloud upload.",
    h1: "Compress PDF for IRS Document Upload Tool (Under 15 MB)",
    subtitle: "Keep SSNs, EINs, and tax notice responses 100% off external servers while shrinking scans under the 15 MB IRS limit.",
    defaultTargetValue: 14500,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "IRS Upload Tool • 15 MB",
    summary: "The IRS Document Upload Tool accepts PDFs up to 15 MB per file (up to 40 files per submission). Because tax documents contain SSNs and financial records, Hashvex PDF processes everything locally in browser memory.",
    relatedSlugs: ["compress-pdf-for-uscis", "compress-pdf-for-court-efiling", "compress-pdf-to-5mb", "compress-pdf-to-2mb"],
    faqs: [
      {
        question: "What is the file size limit for the IRS Document Upload Tool?",
        answer: "The IRS Document Upload Tool supports JPG, PNG, and PDF files up to 15 MB per file, with a maximum of 40 files per upload session."
      },
      {
        question: "Are my tax documents uploaded to Hashvex servers?",
        answer: "Never. All PDF compression happens strictly inside your local browser tab, protecting Social Security Numbers, EINs, and bank statements."
      }
    ]
  },
  {
    slug: "compress-pdf-for-court-efiling",
    kind: "preset",
    title: "Compress PDF for Court E-Filing (Under 25 MB) — Hashvex PDF",
    metaDescription: "Reduce legal briefs, exhibits, and scanned pleadings under 25 MB court e-filing limits locally in your browser—maintaining attorney-client confidentiality.",
    h1: "Compress PDF for Court E-Filing (Under 25 MB)",
    subtitle: "Shrink multi-page exhibits and filings below 25 MB state and federal court limits without exposing privileged files to third-party servers.",
    defaultTargetValue: 24000,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "Legal E-Filing • 25 MB",
    summary: "Most state and federal court e-filing portals enforce a 25 MB per-document ceiling. Hashvex PDF reduces scanned exhibits locally in your browser so confidential client filings never leave your workstation.",
    relatedSlugs: ["compress-pdf-for-irs", "compress-pdf-for-uscis", "compress-pdf-to-5mb", "compress-pdf-to-2mb"],
    faqs: [
      {
        question: "What is the standard PDF size limit for US court e-filing portals?",
        answer: "Most state e-filing systems (such as eFileCA, Tyler Odyssey) and federal CM/ECF portals cap individual PDF documents at 25 MB to 35 MB. Targeting 24 MB ensures smooth submission."
      },
      {
        question: "Does local compression preserve attorney-client confidentiality?",
        answer: "Yes. Unlike cloud PDF tools that upload pleadings to remote servers, Hashvex PDF runs 100% client-side in your browser."
      }
    ]
  },
  {
    slug: "compress-pdf-for-ssc",
    kind: "preset",
    title: "Compress PDF to 100 KB for SSC CGL, CHSL & MTS — Hashvex PDF",
    metaDescription: "Compress caste, EWS, PwBD, and educational certificates under 100 KB for SSC online portals locally in your browser with clear roll numbers and stamps.",
    h1: "Compress PDF to 100 KB for SSC Portals",
    subtitle: "Hit strict 100 KB SSC certificate limits without blurring registration numbers, dates, or issuing authority seals.",
    defaultTargetValue: 95,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "SSC Exams • 100 KB Limit",
    summary: "Staff Selection Commission (SSC) portals frequently cap supporting certificate PDFs at 100 KB. Hashvex PDF uses binary-search quality tuning (and optional Grayscale) to fit scans cleanly under 100 KB.",
    relatedSlugs: ["compress-pdf-to-100kb", "compress-pdf-for-upsc", "compress-pdf-for-gate-neet", "compress-pdf-for-aadhaar-kyc"],
    faqs: [
      {
        question: "How do I compress a certificate PDF under 100 KB for SSC?",
        answer: "Select your certificate PDF, leave the target at 95 KB (safely under 100 KB), and enable Grayscale if it is a multi-page or heavy color scan. Download and verify all text is legible."
      },
      {
        question: "Why should I set 95 KB instead of 100 KB for SSC?",
        answer: "Government portals validate size in binary bytes (100 KiB = 102,400 bytes), whereas Windows/macOS often show decimal KB. Targeting 95 KB prevents borderline byte rejections."
      }
    ]
  },
  {
    slug: "compress-pdf-for-upsc",
    kind: "preset",
    title: "Compress PDF to 300 KB / 200 KB for UPSC OTR & CSE — Hashvex PDF",
    metaDescription: "Compress UPSC OTR photo ID, matriculation, and caste/EWS certificate PDFs between 20 KB and 300 KB locally in your browser—100% private.",
    h1: "Compress PDF for UPSC OTR & Certificate Upload (Under 300 KB)",
    subtitle: "Keep UPSC identity proofs and certificates within the strict 20 KB–300 KB window without uploading Aadhaar or PAN to external servers.",
    defaultTargetValue: 250,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "UPSC OTR • 20–300 KB",
    summary: "UPSC OTR and DAF portals require scanned PDF certificates and photo IDs between 20 KB and 300 KB. Hashvex PDF targets 250 KB locally so your file passes both decimal and binary byte checks.",
    relatedSlugs: ["compress-pdf-to-300kb", "compress-pdf-to-200kb", "compress-pdf-for-ssc", "compress-pdf-for-passport-seva"],
    faqs: [
      {
        question: "What is the UPSC PDF upload size limit for OTR and certificates?",
        answer: "UPSC specifies 20 KB to 300 KB for PDF documents such as caste, PwBD, matriculation certificates, and photo ID proofs. Compressing to 250 KB keeps you safely inside the allowed window."
      },
      {
        question: "Can I compress a password-protected e-Aadhaar PDF for UPSC?",
        answer: "Remove the PDF password first (using Print to PDF or an unlocker) because UPSC rejects encrypted PDFs, then compress the unlocked PDF to 250 KB here."
      }
    ]
  },
  {
    slug: "compress-pdf-for-passport-seva",
    kind: "preset",
    title: "Compress PDF to 300 KB for Passport Seva Portal — Hashvex PDF",
    metaDescription: "Shrink self-attested address proof, birth certificate, and annexure PDFs under 300 KB for Indian Passport Seva locally in your browser.",
    h1: "Compress PDF for Passport Seva Online Upload (Under 300 KB)",
    subtitle: "Prepare crisp, self-attested address and date-of-birth proof PDFs under 300 KB without exposing personal IDs to cloud servers.",
    defaultTargetValue: 280,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "Passport Seva • 300 KB",
    summary: "Passport Seva online document uploads require clear scans under 300 KB. Hashvex PDF compresses multi-page utility bills, bank statements, and marksheets locally on your phone or laptop.",
    relatedSlugs: ["compress-pdf-to-300kb", "compress-pdf-for-upsc", "compress-pdf-for-aadhaar-kyc", "compress-pdf-to-200kb"],
    faqs: [
      {
        question: "What is the maximum file size for Passport Seva document uploads?",
        answer: "Supporting documents uploaded on the Passport Seva portal must generally be under 300 KB with clearly readable text, stamps, and self-attestation signatures."
      },
      {
        question: "Should I self-attest before scanning and compressing?",
        answer: "Yes. Sign and write 'Self-Attested' on the physical photocopy first, scan or photograph it cleanly, convert to PDF, and compress to 280 KB."
      }
    ]
  },
  {
    slug: "compress-pdf-for-gate-neet",
    kind: "preset",
    title: "Compress PDF to 200 KB for GATE, JEE & NEET Forms — Hashvex PDF",
    metaDescription: "Compress category, EWS, PwD, and marksheet PDFs under 200 KB (or 300 KB) for GATE, JoSAA JEE, and NEET UG portals locally in your browser.",
    h1: "Compress PDF for GATE, JEE & NEET Application Portals (Under 200 KB)",
    subtitle: "Fit category certificates, PwD forms, and Class 10/12 marksheets under strict 200 KB entrance exam limits in one click.",
    defaultTargetValue: 190,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "GATE / NEET / JEE • 200 KB",
    summary: "NTA (NEET/JEE) and GATE portals typically cap category and PwD certificate PDFs between 50 KB and 300 KB (most commonly 200 KB). Hashvex PDF hits 190 KB locally while keeping QR codes and certificate numbers scannable.",
    relatedSlugs: ["compress-pdf-to-200kb", "compress-pdf-to-300kb", "compress-pdf-for-ssc", "compress-pdf-for-upsc"],
    faqs: [
      {
        question: "What PDF size is required for GATE and NEET certificate uploads?",
        answer: "Most GATE, NEET UG, and JoSAA counseling portals require certificate PDFs between 50 KB and 200 KB (or up to 300 KB depending on the brochure). Targeting 190 KB satisfies 200 KB limits cleanly."
      },
      {
        question: "Will QR codes and barcodes on my digital certificate stay readable?",
        answer: "Yes. Our binary search picks the highest resolution scale (up to 150%) that fits under your KB cap so QR codes and serial numbers remain crisp."
      }
    ]
  },
  {
    slug: "compress-pdf-for-aadhaar-kyc",
    kind: "preset",
    title: "Compress PDF to 100 KB for Aadhaar, PAN & Bank KYC — Hashvex PDF",
    metaDescription: "Compress Aadhaar, PAN, and e-District KYC PDFs under 100 KB 100% locally in your browser—zero server upload to protect your identity.",
    h1: "Compress PDF for Aadhaar, PAN & Bank KYC (Under 100 KB)",
    subtitle: "Protect your Aadhaar and PAN from cloud leaks—compress KYC documents under 100 KB entirely inside your device's browser.",
    defaultTargetValue: 95,
    defaultTargetUnit: "KB",
    defaultGrayscale: false,
    badge: "Zero-Upload KYC • 100 KB",
    summary: "Uploading Aadhaar, PAN, or bank statements to random cloud compressors exposes sensitive identity data. Hashvex PDF compresses KYC PDFs under 100 KB 100% offline-capable inside your browser.",
    relatedSlugs: ["compress-pdf-to-100kb", "compress-pdf-for-ssc", "compress-pdf-for-passport-seva", "compress-pdf-to-50kb"],
    faqs: [
      {
        question: "Why is browser-based compression safer for Aadhaar and PAN PDFs?",
        answer: "Cloud PDF tools transmit your document to external servers. Hashvex PDF executes all compression in your browser's local RAM—zero bytes of your ID ever touch a network server."
      },
      {
        question: "How do I fit front-and-back ID scans under 100 KB?",
        answer: "Set the target to 95 KB and check Grayscale (smaller output). Hashvex PDF automatically scales both pages so names, DOB, and ID numbers stay legible."
      }
    ]
  }
];

export const PAGE_MAP = new Map<string, PageConfig>(PAGES.map((p) => [p.slug, p]));
