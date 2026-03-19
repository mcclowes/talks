# Now let's go further: Claude Code

What happens when Claude can see your files, your project structure, and run commands.

---

# What Claude Code actually is

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

# Getting started

**Prerequisites:** Node.js 18+, npm, Claude account (any plan)

```bash
$ npm install -g @anthropic-ai/claude-code
$ cd your-project
$ claude
```

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
