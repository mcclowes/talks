---
section: Skills & automation
---

# Write gud pls

You can use skills to enforce writing quality across your team — consistent voice, grammar, and structure without manual review.

```markdown
# Writing Quality Skill

## Rules

- Use active voice. ("The API returns..." not "A response is returned...")
- Sentences under 25 words. Break up long ones.
- No jargon without a definition on first use.
- One idea per paragraph.
- Use second person ("you") not third ("the user").

## Tone

Friendly but precise. Explain like a colleague, not a textbook.

## Common fixes

- "utilise" → "use"
- "in order to" → "to"
- "it should be noted that" → delete
- "please" → delete (docs aren't requests)
```

---

# Layering writing skills

Combine multiple skills to cover different concerns:

- **Style guide skill** — voice, tone, word choice
- **Structure skill** — heading hierarchy, section order, required sections
- **Audience skill** — reading level, assumed knowledge, glossary enforcement
- **Format skill** — markdown conventions, code block rules, link style

Each skill stays focused. Compose them for full coverage.

---

# Before and after

**Without skill:**

> It should be noted that the endpoint utilises a POST method in order to facilitate the creation of new resources. Please ensure that the request body contains the required fields.

**With writing skill:**

> Create a resource by sending a POST request. The request body must include `name` and `type`.

Same information. Half the words. Twice as clear.
