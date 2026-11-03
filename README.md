# Mom's Cake Café

Website for Mom's Cake Café in Victoria, BC — built with Next.js, Tailwind CSS, and TypeScript.

## Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

Business details, menu items, prices, hours, and copy live in [`src/lib/content.ts`](src/lib/content.ts) — edit that file to update most of the site's text without touching page layouts. Menu prices are placeholders pending real pricing.

## Pages

- `/` — home
- `/menu` — full menu
- `/about` — our story
- `/custom-cakes` — custom cake order form
- `/catering` — catering & events
- `/contact` — visit & contact form

The custom cake and contact forms open the visitor's email client with a prefilled message (no backend yet).
