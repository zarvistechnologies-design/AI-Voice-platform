# AI Voice Platform Frontend

This is the Next.js + TypeScript frontend for the AI Voice Platform project.

## Commands

```bash
npm run dev
npm run build
npm run lint
```

The local development server runs at `http://localhost:3000` by default.

## Folder Structure

```text
src/
  app/
    layout.tsx        Root HTML, fonts, and metadata
    page.tsx          Home page composition
    globals.css       Global styles and design tokens
  components/
    layout/           Header, footer, and page shell
    sections/         Home page sections
    ui/               Small reusable UI pieces
  config/
    site.ts           Navigation, footer links, and content constants
  hooks/
    useTheme.ts       Light, dark, and system theme preference
public/               Static assets
```

## Development Notes

- Add page-level sections inside `src/components/sections`.
- Add shared layout pieces inside `src/components/layout`.
- Keep reusable content arrays and site-wide labels in `src/config/site.ts`.
- Keep `src/app/page.tsx` focused on composing the page, not holding all UI code.
