# QR Code Studio

A client-side QR code generator built with Next.js, TypeScript and Tailwind CSS. Design custom QR codes, preview them live, and download them as PNG, SVG, JPEG or PDF.

Everything runs in the browser — content, logos and history never leave the device.

## Features

- **Content types:** URL, plain text, Wi-Fi, vCard, email, SMS, phone
- **Design:** dot and corner styles, solid or gradient colors, transparent background, margin, error correction level
- **Logo:** upload an image, control its size and margin, hide the dots behind it
- **Export:** PNG / JPEG at up to 2048 px, scalable SVG, print-ready PDF
- **History:** save designs to the browser and reload them later
- **No backend:** no database, no accounts, no tracking

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Scripts

| Command             | Description                              |
| ------------------- | ---------------------------------------- |
| `npm run dev`       | Start the development server             |
| `npm run build`     | Production build                         |
| `npm start`         | Serve the production build (Node server) |
| `npm run lint`      | Run ESLint                               |
| `npm run typecheck` | Run TypeScript without emitting files    |
| `npm test`          | Run unit tests with Vitest               |

## Static hosting

The app is fully static. To deploy on any web server (nginx, Caddy, GitHub Pages, …), enable the static export in `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  output: "export",
};
```

Then run `npm run build` and serve the generated `out/` directory. Note that `npm start` is not used in this mode.

## How it works

- `src/lib/qr/encoders.ts` builds the payload string for each content type (Wi-Fi escaping, vCard 3.0, `mailto:`, `SMSTO:`, `tel:`).
- `src/lib/qr/options.ts` maps the design settings to [`qr-code-styling`](https://github.com/kozakdenys/qr-code-styling) options.
- `src/lib/qr/export.ts` renders temporary instances for PNG/JPEG/SVG downloads and wraps the PNG in a PDF via `pdf-lib`.
- `src/lib/store.ts` keeps drafts, design and history in `localStorage` using Zustand's persist middleware.

QR codes are static: the payload is fixed at generation time. There is no redirect service or scan tracking.
