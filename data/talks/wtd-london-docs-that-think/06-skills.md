---
section: Skills & automation
---

# Skills: the foundational fix

A Skill is a markdown file that tells Claude exactly how to behave for a given task.

```markdown
# API Reference Skill

## Voice

Direct, precise. No filler. Assume the reader is a developer.

## Structure

Every endpoint must include: description, parameters
table, request example, response example.

## Format

OpenAPI-compatible. Code blocks use triple backticks
with language tag. Never use passive voice.
```

Store skills in your repo · version-control them · treat them as documentation

---

# Creating skills in claude.ai

![Skill editor in claude.ai](/images/wtd-london-docs-that-think/claude-ai-skill-editor.png)

![Installing a skill in claude.ai](/images/wtd-london-docs-that-think/claude-ai-skill-install.png)

---

# Demo: drafting an API endpoint doc

1. Open claude.ai — new conversation
2. Paste a raw endpoint description (no Skill)
3. Show the output — generic, needs heavy editing
4. Load the API Reference Skill into system prompt
5. Same input — note the structural difference

---

# Prompting is just clear communication

- **Give context** — Who is the reader? What do they already know?
- **Specify the output format** — "Return a markdown table with these columns..."
- **Show an example** — One good example beats a paragraph of instructions.
- **Use positive constraints** — Tell it what to do, not just what to avoid.
- **Iterate, don't regenerate** — Edit the output with a follow-up, don't start over.

---

# Real example: changelog from commits

**Input — raw git log:**

```
fix: handle null response in auth
feat: add pagination to /users
chore: bump axios to 1.6
fix: correct typo in error msg
feat: webhook retry logic
refactor: extract token helper
fix: 500 on empty POST body
```

**Output — with changelog Skill:**

## What's new

- Webhooks now retry automatically on failure.
- User pagination is available on the /users endpoint.

## Bug fixes

- Fixed a 500 error on empty POST requests.
- Auth handles null responses correctly.
   
---

# Keeping skills up to date

Because skills are committed to your repository, just like any other tooling, they can fall behind the thing that they are referencing. And so it's important to ensure that your skills are kept up-to-date by some heuristic. 

You can either:
- do that manually -> regenrate skills, etc.
- you can use skill dependency management tools like npx skill to do this.