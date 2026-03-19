# Talks

A presentation app built with Next.js for delivering talks from markdown files.

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to browse talks.

## Adding a talk

Create a markdown file in `data/talks/`:

```markdown
---
title: My talk
subtitle: A great topic
date: "2026-03-19"
tags: [javascript, react]
---

# First slide

Content here

---

# Second slide

More content
```

Talks can also be directories with `index.md` and additional section files that get merged in alphabetical order.

## Scripts

| Command          | Description              |
| ---------------- | ------------------------ |
| `npm run dev`    | Start development server |
| `npm run build`  | Production build         |
| `npm run start`  | Start production server  |
| `npm run test`   | Run tests                |
| `npm run lint`   | Lint with ESLint         |
| `npm run format` | Format with Prettier     |

## Deployment

Deploy to [Vercel](https://vercel.com) — no additional configuration needed.
