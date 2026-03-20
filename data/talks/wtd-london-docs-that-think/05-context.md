---
section: Context
---

- Context turns it from the vanilla model into something useful
- Context is king.

---

# Context types

Types of context shape AI output:

-  **Instructions** - The prompt
    - Specific task you asked it to do
    - What you let it do for you
    - What it can't do
    - Explicit conventions
-  **Knowledge** — Reference material
    - Files
    - The internet
    - Inferred conventions
    - How you up-skill the AI, e.g. skills

---

If an AI has poor context and instructions, you get crap results.

It's like using basic ChatGPT.

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
- Looking through loads of files to understand things
- Large reference files - JSON, OpenAPI Spec

---

# Stupid AI does stupid things

If you don't *proactively* provide the right context, Claude will:
- Go looking for information (and fill the window)
- Look at/for irrelevant info
- Fail at the task and need to try again

---

# When to reset

Consider starting a new chat or CLI conversation when:

- You have a new task that doesn't relate to the previous prompt
- You're approaching the context window limit of your current session