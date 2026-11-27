import fs from 'node:fs';
import path from 'node:path';
import { createServer } from 'vite';

const DOMAIN = 'https://pdf.hashvex.tech';
const TODAY = '2026-11-27';
const DIST_DIR = path.resolve('dist');

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function pageUrl(slug) {
  return slug ? `${DOMAIN}/${slug}` : `${DOMAIN}/`;
}

function extractBuiltAssets() {
  const builtIndex = fs.readFileSync(path.join(DIST_DIR, 'index.html'), 'utf8');
  const cssLinks = [...builtIndex.matchAll(/<link[^>]+rel="stylesheet"[^>]*>/gi)].map((m) => m[0]);
  const moduleScripts = [...builtIndex.matchAll(/<script[^>]+type="module"[^>]*><\/script>/gi)].map((m) => m[0]);
  return { cssLinks: cssLinks.join('\n  '), moduleScripts: moduleScripts.join('\n  ') };
}

function buildJsonLd(page) {
  const graph = [];
  if (page.kind === 'hub' || page.kind === 'tool') {
    graph.push({
      '@type': 'SoftwareApplication',
      name: page.h1,
      url: pageUrl(page.slug),
      applicationCategory: 'UtilitiesApplication',
      operatingSystem: 'All',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
      description: page.metaDescription,
      author: { '@type': 'Person', name: 'Mohammad Junaid', url: 'https://github.com/junaid-wq' }
    });
  }
  if (page.faqs && page.faqs.length > 0) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: page.faqs.map((f) => ({
        '@type': 'Question',
        name: f.question,
        acceptedAnswer: { '@type': 'Answer', text: f.answer }
      }))
    });
  }
  if (graph.length === 0) return '';
  return `<script type="application/ld+json">\n${JSON.stringify({ '@context': 'https://schema.org', '@graph': graph }, null, 2)}\n  </script>`;
}

function renderHtml(page, pageMap, assets) {
  const canonical = pageUrl(page.slug);
  const showTool = page.kind === 'hub' || page.kind === 'tool';

  const toolMount = showTool
    ? `<section aria-label="PDF Compressor Tool">
        <div id="compressor-root"
             data-default-value="${page.defaultTargetValue ?? 200}"
             data-default-unit="${page.defaultTargetUnit ?? 'KB'}"
             data-default-grayscale="${page.defaultGrayscale ? 'true' : 'false'}">
          <noscript><p class="banner banner-error">JavaScript is required to run the local browser PDF compressor.</p></noscript>
        </div>
      </section>`
    : '';

  const relatedLinksHtml = page.relatedSlugs
    .map((s) => pageMap.get(s))
    .filter(Boolean)
    .map((p) => `<a class="pill-link" href="/${p.slug}">${escapeHtml(p.h1)}</a>`)
    .join('\n          ');

  const relatedSection = relatedLinksHtml
    ? `<section class="content-section" aria-label="Related PDF Compression Sizes">
        <h2>${page.kind === 'hub' ? 'Preset PDF Size Compressors' : 'Related PDF Size Limits'}</h2>
        <div class="pill-grid">
          ${page.kind !== 'hub' ? '<a class="pill-link" href="/">← Custom Size PDF Compressor (Hub)</a>' : ''}
          ${relatedLinksHtml}
        </div>
      </section>`
    : '';

  const faqSection =
    page.faqs && page.faqs.length > 0
      ? `<section class="content-section" aria-label="Frequently Asked Questions">
          <h2>Frequently Asked Questions</h2>
          <div class="faq-list">
            ${page.faqs
              .map(
                (f) => `<article class="faq-item">
              <h3>${escapeHtml(f.question)}</h3>
              <p>${escapeHtml(f.answer)}</p>
            </article>`
              )
              .join('\n            ')}
          </div>
        </section>`
      : '';

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(page.title)}</title>
  <meta name="description" content="${escapeHtml(page.metaDescription)}" />
  <meta name="robots" content="index, follow, max-image-preview:large" />
  <link rel="canonical" href="${canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Hashvex PDF" />
  <meta property="og:title" content="${escapeHtml(page.title)}" />
  <meta property="og:description" content="${escapeHtml(page.metaDescription)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(page.title)}" />
  <meta name="twitter:description" content="${escapeHtml(page.metaDescription)}" />
  ${buildJsonLd(page)}
  ${assets.cssLinks}
  <!-- CLOUDFLARE WEB ANALYTICS PLACEHOLDER: Paste Cloudflare Web Analytics <script defer src='https://static.cloudflareinsights.com/beacon.min.js' data-cf-beacon='{"token": "YOUR_TOKEN"}'></script> here -->
</head>
<body>
  <header class="site-header">
    <div class="container header-inner">
      <a class="brand" href="/">
        <span class="brand-hash" aria-hidden="true">#</span>
        <span>HASHVEX</span>
        <span class="brand-badge">PDF</span>
      </a>
      <nav class="header-nav" aria-label="Primary Navigation">
        <a href="/">All Sizes</a>
        <a href="/compress-scanned-pdf">Scanned PDF</a>
        <a href="https://hashvex.tech">More Hashvex tools</a>
      </nav>
    </div>
  </header>

  <main class="container">
    <section class="hero">
      <h1>${escapeHtml(page.h1)}</h1>
      <p class="answer-box">${escapeHtml(page.answerFirst)}</p>
    </section>

    ${toolMount}

    <!-- AD SLOT TOP: Reserved layout-stable banner slot (min-height: 100px). Paste Google AdSense <ins> unit here. -->

    <article class="content-section">
      ${page.bodyHtml}
    </article>

    ${relatedSection}

    ${faqSection}

    <!-- AD SLOT BOTTOM: Reserved layout-stable banner slot (min-height: 100px). Paste Google AdSense <ins> unit here. -->
  </main>

  <footer class="site-footer">
    <div class="container">
      <div class="footer-links">
        <a href="/">Home (Custom Size)</a>
        <a href="/about">About</a>
        <a href="/privacy">Privacy Policy</a>
        <a href="/contact">Contact</a>
        <a href="https://hashvex.tech">More Hashvex tools</a>
      </div>
      <p style="margin:0;">100% browser-based PDF compression. Files never leave your device.</p>
    </div>
  </footer>

  ${showTool ? assets.moduleScripts : ''}
</body>
</html>`;
}

async function run() {
  const vite = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
  try {
    const { PAGES, PAGE_MAP } = await vite.ssrLoadModule('/src/data/pages.ts');
    const assets = extractBuiltAssets();

    const sitemapUrls = [];

    for (const page of PAGES) {
      const outDir = page.slug ? path.join(DIST_DIR, page.slug) : DIST_DIR;
      fs.mkdirSync(outDir, { recursive: true });
      const html = renderHtml(page, PAGE_MAP, assets);
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf8');

      const priority = page.slug === '' ? '1.0' : page.kind === 'tool' ? '0.9' : '0.5';
      const changefreq = page.kind === 'info' ? 'monthly' : 'weekly';
      sitemapUrls.push(
        `  <url><loc>${pageUrl(page.slug)}</loc><lastmod>${TODAY}</lastmod><changefreq>${changefreq}</changefreq><priority>${priority}</priority></url>`
      );
    }

    const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls.join('\n')}\n</urlset>\n`;
    fs.writeFileSync(path.join(DIST_DIR, 'sitemap.xml'), sitemapXml, 'utf8');

        const robotsTxt = `User-agent: *\nAllow: /\nDisallow: /cdn-cgi/\n\nSitemap: ${DOMAIN}/sitemap.xml\n`;
    fs.writeFileSync(path.join(DIST_DIR, 'robots.txt'), robotsTxt, 'utf8');

    const toolPages = PAGES.filter((p) => p.kind === 'hub' || p.kind === 'tool');
    const llmsTxt = [
      '# Hashvex PDF (pdf.hashvex.tech)',
      '> Free, zero-upload, 100% client-side PDF compressor built by Mohammad Junaid. Compresses PDFs to exact KB or MB limits inside the browser using lossless object-stream packing (Step A) and adaptive PDF.js canvas + binary-search JPEG optimization (Step B).',
      '',
      '## PDF Size Compression Tools',
      ...toolPages.map((p) => `- [${p.h1}](${pageUrl(p.slug)}): ${p.metaDescription}`),
      '',
      '## Ecosystem',
      '- Main Hub: [Hashvex Tech](https://hashvex.tech)',
      '- Related Tools: [Hashvex Hash Studio](https://hash.hashvex.tech), [SyntraForge Media Suite](https://syntraforge.me), [Skewlux Telemetry Lab](https://skewlux.dev)'
    ].join('\n') + '\n';
    fs.writeFileSync(path.join(DIST_DIR, 'llms.txt'), llmsTxt, 'utf8');

    const llmsFullTxt = [
      '# Hashvex PDF - Complete Technical & Tool Reference (pdf.hashvex.tech)',
      '> Privacy-first, zero-server-logging browser PDF compressor engineered by Mohammad Junaid.',
      '',
      '## Architecture & Privacy Guarantee',
      'All PDF parsing, lossless object-stream optimization (pdf-lib), page rendering (pdfjs-dist), and grayscale/JPEG binary search run 100% locally inside browser memory. No PDF bytes ever leave the user device.',
      '',
      '## Pages & Frequently Asked Questions',
      ...toolPages.flatMap((p) => [
        `### ${p.h1} (${pageUrl(p.slug)})`,
        p.answerFirst,
        ...p.faqs.map((f) => `- **${f.question}** ${f.answer}`),
        ''
      ])
    ].join('\n') + '\n';
    fs.writeFileSync(path.join(DIST_DIR, 'llms-full.txt'), llmsFullTxt, 'utf8');

    console.log(`Built ${PAGES.length} static HTML pages + sitemap.xml + robots.txt + llms.txt + llms-full.txt into ${DIST_DIR}`);
  } finally {
    await vite.close();
  }
}

run();
