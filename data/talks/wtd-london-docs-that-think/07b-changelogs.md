---
section: AI-friendly docs
---

# AI-friendly changelogs

Most changelogs are written for humans scanning a list. LLMs need something different — structured, filterable, action-oriented.

The question isn't "what's new?" — it's **"does this affect what I'm doing, and what do I need to change?"**

---

# What makes a changelog LLM-friendly?

- **Structured** — Machine-parseable, not freeform prose
- **Diff-oriented** — Show what changed, not just what exists now
- **Self-contained** — Each entry understandable without surrounding context
- **Migration-first** — Lead with "what to do" not "what we did"
- **Scoped** — Tagged by API surface area so agents can filter to what they care about

---

# Structured changelog format

```yaml
version: "2.3.0"
date: 2025-03-19
changes:
  - type: breaking
    scope: auth/oauth
    summary: OAuth token endpoint moved
    before: POST /oauth/token
    after: POST /v2/oauth/token
    migration: >
      Update your base URL. The old endpoint
      returns 301 until 2025-06-01, then 404.
    affected_pages:
      - docs/auth/oauth.md
      - docs/api/endpoints.md

  - type: deprecation
    scope: billing/invoices
    summary: Legacy invoice format deprecated
    migration: >
      Switch to v2 invoice objects. See
      docs/billing/migration.md for field mapping.
    sunset: 2025-09-01
```

---

# Delivering changelogs to AI consumers

**Alongside llms.txt** — Add a changelog pointer so AI tools know where to look:

```markdown
# Acme API

> API documentation for Acme

## Docs
- [API Reference](https://docs.acme.com/api)

## Changes
- [Changelog](https://docs.acme.com/llms-changelog.yaml)
```

---

# Delivery mechanisms

**For context-file consumers** — A rolling `CHANGELOG.llm.yaml` optimized for token efficiency. Only last N versions, link to full history.

**For MCP tools** — Expose a `get_changelog` tool that accepts filters: `since`, `scope`, `breaking_only`. Agents query only what's relevant.

**For push-based delivery** — Webhooks on publish, RSS feeds with structured content. Consuming apps subscribe rather than poll.

**The pattern:** Publish changelog entries as individual chunks with metadata so they retrieve cleanly in RAG pipelines.

---

# Automating it in docs-as-code

If your docs are in git, you can automate this:

1. Each PR that changes docs includes a structured changelog entry (enforce via CI)
2. On merge, a build step appends to `CHANGELOG.llm.yaml`
3. That file is published alongside the docs
4. Consuming apps fetch it, subscribe via webhook, or query through an MCP tool

Your docs pipeline already does the hard work — you're just adding a machine-readable output format.
