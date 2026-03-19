---
section: Skills & automation
---

# Claude as your docs tester

You wrote the docs. But do they actually work?

**Give Claude your documentation and ask it to follow the instructions as a new user would.**

It will hit every gap, ambiguity, and wrong assumption — faster than any human reviewer.

---

# How it works

1. Point Claude at your getting started guide or tutorial
2. Ask it to follow the steps exactly as written
3. It executes each instruction, flags where it gets stuck

```bash
claude "You are a developer using this product for the first
  time. Follow the getting started guide in /docs/quickstart.md
  exactly as written. Do not use any knowledge beyond what the
  docs provide. Flag every point where the instructions are
  unclear, incomplete, or fail."
```

Claude doesn't skim. It doesn't fill in gaps from memory. It does exactly what the docs say — and breaks where your users would break.

---

# What it catches

**Missing steps** — "Install the SDK" but no mention of which package manager or version

**Implicit assumptions** — Docs assume Node 18+ but never say so. Claude tries with what's available and fails.

**Stale examples** — Code snippets that worked six months ago but reference a renamed endpoint

**Ordering issues** — Step 4 references a value from step 2 that was never saved to a variable

**Environment gaps** — "Set your API key" but no mention of where or in what format

---

# Making it repeatable

Run this as part of your CI pipeline — every time docs change, Claude walks through them again.

```yaml
# In your CI workflow
- name: Test documentation
  run: |
    claude --print "Follow the quickstart guide in docs/
      quickstart.md step by step. Execute each code block.
      Report: which step failed, what was unclear, and
      what was missing." > docs-test-report.md
```

**Docs that can't be followed are docs that don't work.** Catch it before your users do.
