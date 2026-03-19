# Build it to prove it

Your docs say "follow these steps to build X." But did anyone actually follow them?

**Demo apps are documentation tests.** Give your docs to Claude Code and ask it to build the thing your docs describe — using only the docs as context.

- If Claude can't build it, your reader can't either
- If the app breaks, your docs have a gap
- If it works, you've got a working sample app for free

---

# Dogfooding your docs with AI

```bash
# Point Claude Code at your docs and let it build
claude "Using only the documentation in /docs/getting-started,
  build the sample app described in the quickstart guide.
  Do not use any knowledge beyond what's in these docs."
```

**What this catches:**

- Missing steps ("install this dependency" was never mentioned)
- Wrong order (step 3 depends on something in step 5)
- Ambiguous instructions (Claude guesses — so will your users)
- Outdated code samples (the API changed, the docs didn't)

---

# From validation to value

The demo apps you build aren't throwaway — they become assets:

- **Sample repos** — Ship them alongside your docs
- **CI validation** — Rebuild from docs on every merge to catch drift
- **Onboarding accelerators** — New developers clone and run instead of reading

Your documentation becomes executable. If the build breaks, the docs are wrong.

---

# A docs-as-tests workflow

1. **Write the guide** — Document the feature as you normally would
2. **Feed it to Claude** — Ask it to follow the guide exactly, nothing more
3. **Watch it fail** — Every failure is a gap in your docs
4. **Fix the docs, not the app** — The app is the test; the docs are the code
5. **Commit both** — The sample app ships with the docs as proof they work
