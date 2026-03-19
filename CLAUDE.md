# Talks

A Next.js presentation app for delivering talks from markdown files.

## Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: SCSS modules
- **Testing**: Vitest
- **Linting**: ESLint (next/core-web-vitals) + Prettier
- **Deployment**: Vercel

## Project structure

- `src/app/` — Next.js App Router pages
- `src/components/` — React components (PresentationMode, SlideContent, QRCode)
- `src/lib/talks.ts` — Talk data loading from markdown files
- `data/talks/` — Markdown talk files (single `.md` or directory with `index.md` + sections)

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run lint         # ESLint
npm run format       # Prettier format
npm run format:check # Prettier check
```

## Talk format

Talks are markdown files in `data/talks/`. Slides are separated by `---`. Each slide can have a `# heading` as the title. Frontmatter supports `title`, `subtitle`, `date`, and `tags`.

## Path aliases

`@/*` maps to `./src/*`
