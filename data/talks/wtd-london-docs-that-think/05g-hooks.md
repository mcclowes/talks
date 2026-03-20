---
section: Skills & automation
---

# Hooks: automating doc maintenance

Skills tell Claude *how* to do something. Hooks tell Claude *when* to do it.

**Claude Code hooks** are shell commands that run automatically in response to events — like a commit, a file save, or a prompt submission.

For docs teams, this means maintenance tasks that just... happen.

---

# What hooks look like

Hooks are configured in your Claude Code settings:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Bash(git commit:*)",
        "command": "echo 'Check if docs need updating'"
      }
    ]
  }
}
```

**Events you can hook into:**

- `PreToolUse` / `PostToolUse` — before or after a tool runs
- `UserPromptSubmit` — when a prompt is sent

---

# Slash commands for doc workflows

Slash commands (custom commands invoked with `/name`) give your team repeatable doc tasks:

**/rtf** — "Read the manual." Reviews CLAUDE.md and project docs, checks them against the actual codebase, and flags anything out of date.

**/review** — Runs a quality check on staged changes — style, accuracy, broken links.

**/commit-push** — Stages, commits with a meaningful message, and pushes. Consistent commit hygiene without thinking about it.

These live in your repo as markdown files in `.claude/commands/`. Anyone on the team can use them.

---

# Keeping docs in sync automatically

The real power: combining hooks with slash commands to catch doc drift at the point it happens.

**Example: post-commit doc check**

After every commit that touches source code, a hook prompts Claude to check whether the README or API docs need updating.

```
Developer changes an API endpoint
  → commit triggers hook
    → Claude reads the diff
      → flags that the API docs reference
        the old endpoint path
```

No ticket. No "I'll update the docs later." The drift is caught immediately.

---

# Practical hook ideas for doc teams

- **After code changes** — Check if related docs are still accurate
- **Before PR creation** — Validate that doc changes match code changes
- **On prompt submit** — Auto-load relevant style guides or skills
- **After file creation** — Suggest adding the new file to your docs index

The pattern: **reduce the gap between "something changed" and "the docs reflect that change."**
