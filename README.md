# Hashvex PDF (pdf.hashvex.tech)

Static, SEO-first browser PDF compressor built with Vite, TypeScript, pdf-lib, and pdfjs-dist. Every page is pre-rendered to static HTML at build time, and all PDF compression runs 100% locally in the user's browser with zero server uploads.

## Local Development & Build

    npm install
    npm run build

npm run build compiles the client TypeScript/CSS bundle with Vite and runs node scripts/build-pages.mjs to generate /dist/index.html, /dist/<slug>/index.html, /dist/sitemap.xml, /dist/robots.txt, /dist/llms.txt, and /dist/llms-full.txt.

## How to Add a New Size Page

1. Open src/data/pages.ts.
2. Add a new object to the PAGES array with slug, kind: 'tool', title, metaDescription, h1, answerFirst, defaultTargetValue, defaultTargetUnit, relatedSlugs, faqs, and bodyHtml.
3. Add the new slug to relatedSlugs on the root hub (slug: '') and neighboring size pages.
4. Run npm run build to generate the new static page and update sitemap.xml and llms.txt.

## Deploy to Cloudflare Pages

1. Push this repository to GitHub.
2. In Cloudflare Dashboard -> Workers & Pages -> Create -> Pages -> Connect to Git, select your repository.
3. Configure build settings:
   - Framework preset: None
   - Build command: npm run build
   - Build output directory: dist
4. Click Save and Deploy.

## Connect pdf.hashvex.tech

1. In your Cloudflare Pages project, open Custom domains -> Set up a custom domain.
2. Enter pdf.hashvex.tech and continue. Cloudflare automatically creates the proxied CNAME record and provisions SSL.
