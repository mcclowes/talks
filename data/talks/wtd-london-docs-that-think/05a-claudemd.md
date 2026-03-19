---
section: Claude.md
---

# CLAUDE.md — your first guardrail

A markdown file in your repo root that Claude Code reads automatically on every session.

```markdown
# Project name

## Stack
Next.js, TypeScript, Docusaurus for docs

## Commands
npm run build, npm run test, npm run docs:build

## Rules
- Never modify files in /src/generated
- Docs use sentence case, not title case
- API docs must include request/response examples
- Run lint before committing
```

- **Always loaded** — no need to paste context each time
- **Version-controlled** — rules travel with the repo
- **Shared** — every contributor (and Claude) gets the same instructions
- **Hierarchical** — nest CLAUDE.md files in subdirectories for scoped rules

Don't make it too big