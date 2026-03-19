---
section: Guardrails
---

# Guardrails

1. what you let it do for you
2. how you up-skill the ai - e.g. skills
2. tooling support - e.g. spell check

---

# Using AI cautiously

**Trust (with verification):**

- Structure and format
- First drafts from good briefs
- Refactoring existing content
- Summarising long inputs

---

# Using AI cautiously

**Verify carefully:**

- Technical accuracy — check source
- Anything touching product behaviour
- Generated code, especially auth/data
- Links and references

---

# Using AI cautiously

**Never delegate:**

- Final editorial judgment
- Accuracy sign-off
- Security or compliance content
- Anything going direct to prod

---

# When it goes wrong

**Confident hallucination** — Describes a query parameter that doesn't exist, in a tone that suggests it definitely does. Always check parameter names against source.

**Voice drift** — Without a Skill, defaults to generic, slightly corporate. Fine for a draft. Bad if it ships.

**Outdated context** — Its training data has a cutoff. If your API changed recently, Claude may document the old version.

**Over-documentation** — It loves thoroughness. Sometimes you need one sentence. Tell it so in the Skill.

---

# A practical workflow

1. **Write your Skills first** — One Skill per doc type. Voice, structure, format, constraints. Store in repo.
2. **Draft with Claude** — AI handles the blank page. You handle the brief.
3. **Review technically** — Read it. Check it against source. Fix what's wrong.
4. **Run the CI checks** — Lint, links, spelling — automated, before review.
5. **Human editorial pass** — Read it as your reader would. Does it make sense?
6. **Commit and iterate** — Update Skills when output quality drifts.
