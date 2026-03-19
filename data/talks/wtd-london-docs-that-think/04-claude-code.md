---
section: Claude Code
---

# Now let's go further: Claude Code

What happens when Claude can see your files, your project structure, and run commands.

---

# What Claude Code actually is

![Claude Code terminal](/images/wtd-london-docs-that-think/claude-code-terminal.png)

**It is:**

- A CLI tool you run in your terminal
- Claude with access to your entire project
- Can read files, write files, run commands
- Understands code and docs simultaneously
- Works with your existing git workflow

  
**It is not:**

- A magic docs-generator
- Always right about what your code does
- A replacement for reading the source
- Fully autonomous — it asks before it acts
- A reason to skip review

---

# Claude Code in the browser

![Claude Code in the browser](/images/wtd-london-docs-that-think/claude-code-browser.png)

- Same capabilities — file access, git, commands — but from **claude.ai**
- No terminal required
- Great for quick tasks or when you're away from your usual setup

---

# Getting started

**Prerequisites:** Node.js 18+, npm, Claude account (any plan)

```bash
$ npm install -g @anthropic-ai/claude-code
$ cd your-project
$ claude
```

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

---

# Demo: reading a project and drafting API reference docs

```
$ claude

> Look at the routes in /src/api. Draft API reference
  docs for each endpoint in /docs/api-reference.md.
  Use the Skill in /docs/skills/api-reference.md.

  reading 12 files...
  drafting /docs/api-reference.md...

done. 847 words. review before committing.
```

---

# Docs-as-code with Docusaurus

When your docs live in the repo, Claude Code can work across both simultaneously.

- **Markdown + git** — Docs live alongside code. PRs include doc changes. History is shared.
- **Docusaurus** — Generates a site from markdown. Sidebar, search, versioning — built in.
- **Claude Code sees both** — Read source, understand existing docs structure, write new content that fits.
- **Skills in the repo** — Your editorial rules travel with the project. New contributors get them too.

---

# Shared skills: one source of truth

Why write your own Docusaurus skills from scratch?

```bash
npx skills add mcclowes/claude-docusaurus-skills
```

Six skills covering the full Docusaurus workflow:

- **Config validation** — catches invalid URLs, broken plugins, missing fields
- **Documentation lookup** — latest APIs, markdown features, best practices
- **v2 to v3 migration** — MDX v1 to v3, React 18, breaking changes
- **Plugin creation** — remark, rehype, theme, content, lifecycle
- **Theme customisation** — swizzling navbar, footer, sidebar, layouts
- **Google style guide** — consistent voice and structure across contributors

Open source. Version-controlled. Fix a skill once, everyone gets the fix.
