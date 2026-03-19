---
section: Skills & automation
---

# The activation problem

Skills are powerful — but Claude often won't use them unless you ask.

> Context window management

- Skill auto-activation hovers around **~50%** without intervention
- Claude defaults to answering from existing knowledge
- It has the specialised tool but doesn't reach for it
- Research found **AGENTS.md/CLAUDE.md inline docs outperform skills** in benchmarks

The bottleneck isn't the knowledge — it's the trigger.

---

# Forcing activation

Scott Spence's three-step forced evaluation:

1. **EVALUATE** — for each skill, state YES/NO with reasoning
2. **ACTIVATE** — call `Skill()` immediately
3. **IMPLEMENT** — only then start the task

```markdown
INSTRUCTION: MANDATORY SKILL ACTIVATION SEQUENCE

Step 1 - EVALUATE:
For each skill, state: [skill-name] - YES/NO - [reason]

Step 2 - ACTIVATE:
IF any skills are YES → Use Skill() for EACH relevant skill NOW

Step 3 - IMPLEMENT:
Only after Step 2 is complete, proceed with implementation.
```

This pushes activation rates from ~50% to **80-84%**.

---

# What this means for docs teams

- **Skills work** — but treat activation as a known limitation
- **CLAUDE.md is more reliable** for rules you always need followed
- **Explicit invocation** (`/skill-name`) is the safest path for critical workflows
- **Write precise descriptions** — vague descriptions = lower activation
- **Hooks can force evaluation** — automate the three-step check as a prompt hook

Match the mechanism to the stakes: CLAUDE.md for guardrails, skills for specialised tasks, hooks for enforcement.
