---
title: Living documentation
subtitle: Using Claude and Claude Code in technical writing workflows
date: "2025"
tags:
  - write the docs
  - claude
  - documentation
  - AI
resources:
  - title: Claude Code docs
    url: https://docs.anthropic.com/en/docs/claude-code
    description: Official Claude Code documentation
  - title: CLAUDE.md best practices
    url: https://docs.anthropic.com/en/docs/claude-code/claude-md
    description: Guide to writing effective CLAUDE.md files
  - title: Claude Code hooks
    url: https://docs.anthropic.com/en/docs/claude-code/hooks
    description: Automate workflows with lifecycle hooks
summary: |
  We cover how technical writers can use Claude Code to work more effectively with docs-as-code workflows. We look at the differences between the standard Claude chat interface and Claude Code, focusing on how Claude Code can access local files, understand project structure, and run terminal commands. We dig into context windows, the `claude.md` project file, and well-structured prompts — all key to making the model behave like an informed collaborator rather than a generic chatbot.

  A major focus is the skills system: project- or task-specific instructions that extend `claude.md`. Skills can encode style guides, API-writing conventions, branding, and more, and live alongside the docs in version control so teams share the same "AI configuration." Because Claude doesn't always activate skills on its own, we explore ways to force activation via slash commands and hooks, and touch on (often unnecessary) MCP integrations for live connections to tools like GitHub, Confluence, or Notion.

  We then zoom out to how AI fits into the broader documentation pipeline — using Claude Code with GitHub, Docusaurus, and Vercel to enforce quality (via GitHub Actions, Vale, link checkers), generate and test sample apps from docs, and keep diagrams (e.g., Mermaid) and changelogs in sync. We also highlight emerging needs like `llms.txt` files and meaningful URL structures so LLMs can reliably consume and navigate documentation. Throughout, we stress that AI output must be reviewed by humans — especially for technical accuracy and security — and frame these tools as a way to free writers from drudge work so they can spend more time on structure, clarity, and editorial judgment.
---

# Living documentation

{{bg:/images/wtd-london-docs-that-think/logo-claude.svg}}

Write the Docs London · Workshop

@mcclowes

{{qr:https://talks.mcclowes.com/wtd-london-docs-that-think}}
