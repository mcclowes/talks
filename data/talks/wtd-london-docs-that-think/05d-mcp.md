---
section: Skills & automation
---

# MCP: connecting Claude to your tools

**Model Context Protocol** is an open standard that lets Claude talk to external services — APIs, databases, SaaS tools — through a consistent interface.

- **Skills** = how Claude should behave
- **Hooks** = when Claude should act
- **MCP** = what Claude can access

MCP servers are lightweight connectors. You can use community servers or write your own.

---

# MCP for doc workflows

Give Claude direct access to your doc toolchain:

| MCP server | What it does |
|---|---|
| **GitHub** | Read issues, PRs, code — no copy-pasting |
| **Confluence / Notion** | Pull existing docs as context |
| **Sentry / Datadog** | Check real errors when writing troubleshooting guides |
| **PostgreSQL** | Query schema directly for data model docs |
| **Custom API** | Hit your staging server to verify endpoint behaviour |

Instead of pasting context into a prompt, Claude fetches what it needs — live, from the source.

---

# Setting up an MCP server

In your Claude Code settings or `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"],
      "env": { "GITHUB_TOKEN": "..." }
    }
  }
}
```

Once configured, Claude can use the server's tools automatically — no extra prompting needed.
