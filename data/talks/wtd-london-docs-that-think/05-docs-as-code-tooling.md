---
section: Docs-as-code tooling
---

# Docs-as-code with Docusaurus

When your docs live in the repo, Claude Code can work across both simultaneously.

- **Markdown + git** — Docs live alongside code. PRs include doc changes. History is shared.
- **Docusaurus** — Generates a site from markdown. Sidebar, search, versioning — built in.
- **Claude Code sees both** — Read source, understand existing docs structure, write new content that fits.
- **Skills in the repo** — Your editorial rules travel with the project. New contributors get them too.

---

# My preferred stack

![Claude](/images/wtd-london-docs-that-think/logo-claude.svg) ![GitHub](/images/wtd-london-docs-that-think/logo-github.svg) ![Vercel](/images/wtd-london-docs-that-think/logo-vercel.svg) ![Next.js](/images/wtd-london-docs-that-think/logo-nextjs.svg) ![Docusaurus](/images/wtd-london-docs-that-think/logo-docusaurus.svg)

## Three tools, one pipeline

1. **Claude + Claude Code** — write, edit, and review docs with AI
2. **GitHub + GitHub Actions** — version, collaborate, and automate
3. **Vercel + Next.js/Docusaurus** — build and deploy

Everything lives in code. Everything goes through CI. You're basically working in three tools — and they all talk to each other.

---

# Tooling

One of the most useful things about having docs as code is you can implement tooling that self-manages and supports doing quite complicated things.

You can use tools to:
- enforce a style guide
- spell check (with customizations based on your company's language and vocabulary)
- Generating content
- custom components
- check links are valid
- auto-generate changelogs

---

# The "ask an engineer" bottleneck

Things technical writers often can't do alone in Docusaurus:

- **Custom components** — Admonitions, API playgrounds, tabbed code blocks. It's React — you need a developer.
- **Styling changes** — Brand refresh? New colour scheme? That's CSS modules and theme overrides.
- **Swizzling** — Customising the navbar, footer, or sidebar means ejecting theme components and editing JSX.
- **Plugin work** — Remark/rehype plugins for custom markdown syntax. Build pipeline stuff.
- **Config changes** — Adding a new sidebar category, enabling a plugin, changing the base URL.
- **Dependency upgrades** — Docusaurus v2 to v3 migration. MDX v1 to v3. Breaking changes everywhere.

Every one of these creates a ticket, a context switch, and a wait.

---

# Claude Code changes who can do this

With Claude Code, a technical writer can:

```
> Add a "deprecated" admonition style with a red
  left border and a warning icon. Match the existing
  admonition component patterns.

> Swizzle the footer and add a second row of links
  for our API docs section.

> Create a remark plugin that auto-links any mention
  of an API endpoint name to its reference page.
```

You describe what you want in plain English. Claude reads the project, understands the Docusaurus conventions, and writes the code.

**You review the diff. You approve the PR. No engineer ticket needed.**

---

# Building real tooling

Plugins, automation, and catching issues before they ship.

Examples:
- GitHub Actions for doc quality checks
- Automating changelog generation on release
- Building a Docusaurus glossary plugin

---

# GitHub Actions

![GitHub CI checks on a pull request](/images/wtd-london-docs-that-think/github-ci-checks.png)

Broken links, markdown formatting, spell check — all caught before review. No human needed to flag these.

---

# What's a GitHub Action?

A GitHub Action is an automated task that runs when something happens in your repository.

**Think of it as a robot colleague that reacts to events:**

- Someone opens a PR → run spell check
- A file in `docs/` changes → validate all links
- A release is published → generate a changelog

You define the rules in a YAML file. GitHub runs them for you. No server, no cron job, no asking DevOps.

**For docs teams, this means quality checks that run automatically — before anyone reviews.**

---

# CI quality checks for docs

A GitHub Action that runs on every PR touching docs:

```yaml
name: Docs Quality Check
on:
  pull_request:
    paths: ["docs/**"]

jobs:
  lint-docs:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Check broken links
        run: npx markdown-link-check docs/**/*.md
      - name: Vale style lint
        uses: errata-ai/vale-action@v2
        with:
          files: docs/
      - name: Spell check
        run: npx cspell "docs/**/*.md"
```

---

# Building a Docusaurus glossary plugin

A real example — open-source, built with Claude Code as a pair programmer.

1. **Add skills** — Give Claude Code [Docusaurus-specific skills](https://github.com/mcclowes/claude-docusaurus-skills) so it understands the framework's conventions and plugin architecture.
2. **Brief Claude Code** — Describe what the plugin should do. Reference existing Docusaurus plugin architecture.
3. **Show it the structure** — Point it at the Docusaurus source. Let it understand how plugins are registered.
4. **Iterate on the output** — Ask for changes, review diffs, catch logic errors. You're still the engineer.
5. **Test and publish** — Claude can write the tests. You review and ship.

---

# Here's one I made earlier

It's essential that Claude has the right skills — domain-specific context makes all the difference. [mcclowes/claude-docusaurus-skills](https://github.com/mcclowes/claude-docusaurus-skills)

{{npm:docusaurus-plugin-cookie-consent}}
{{github:mcclowes/docusaurus-plugin-cookie-consent}}