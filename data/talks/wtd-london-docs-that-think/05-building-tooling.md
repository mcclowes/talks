# Building real tooling

Plugins, automation, and catching issues before they ship.

- Building a Docusaurus glossary plugin
- GitHub Actions for doc quality checks
- Automating changelog generation on release

---

# Building a Docusaurus glossary plugin

A real example — open-source, built with Claude Code as a pair programmer.

1. **Brief Claude Code** — Describe what the plugin should do. Reference existing Docusaurus plugin architecture.
2. **Show it the structure** — Point it at the Docusaurus source. Let it understand how plugins are registered.
3. **Iterate on the output** — Ask for changes, review diffs, catch logic errors. You're still the engineer.
4. **Test and publish** — Claude can write the tests. You review and ship.

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
