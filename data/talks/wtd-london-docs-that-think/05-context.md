---
section: Context
---

Context is everything

---

# Context types

Types of context shape AI output:

1. **Prompt** - what you asked it to do
2. **Knowledge** — reference material, conventions, how you up-skill the AI, e.g. skills
3. **Context window** - what the model is looking at currently
4. **Guardrails** — what you let it do for you, what it can't do

---

If an AI has poor context and instructions, you get crap results.

Just like using basic ChatGPT.

---

# Context window

AI isn't omniscient - it has to decide what to add to its context window.

- Window = Knowledge it has (currently) in context.
- Size = How much text a model can "see" at once

Size and behaviour varies per model (and plan)

---

# Context vs. context overload

If you reach the context window limit, it compacts (forgets things).

Things that use up context window:
- Prompts
- Skills
- Reference files - JSON, OpenAPI Spec