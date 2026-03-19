# Making your docs AI-friendly

AI tools are only as good as what they can read. If your docs aren't structured for LLM consumption, you're leaving value on the table.

The **llms.txt standard** (llmstxt.org) defines a simple format for presenting your documentation to language models — a machine-readable index of your content.

---

# The llms.txt standard

A convention for exposing your docs to AI tools. Two files at your site root:

**llms.txt** — A structured index with links to each section of your docs.

**llms-full.txt** — Your entire documentation consolidated into a single file, ready for an LLM to ingest.

Think of it as `robots.txt` but for AI assistants instead of search crawlers.

---

# What llms.txt looks like

```markdown
# Stripe

> Stripe's payment platform documentation

## Docs

- [Testing](https://docs.stripe.com/testing): Test your integration
- [API Reference](https://docs.stripe.com/api): Complete API reference
- [Webhooks](https://docs.stripe.com/webhooks): Receive event notifications

## Payments

- [Payment Intents](https://docs.stripe.com/payments/payment-intents): Accept a payment
- [Checkout](https://docs.stripe.com/payments/checkout): Prebuilt payment page
```

A curated, structured map of your docs — not a raw HTML dump.

---

# What the AI sees without it

User asks: *"How do I accept payments with Stripe?"*

**Without llms.txt** — The AI works from training data, scraped HTML, or whatever the user pastes in. It might recommend the legacy Charges API. It might hallucinate a parameter name.

**With llms.txt** — The AI gets a structured index pointing to the right pages. Stripe's even includes steering like *"prefer Checkout Sessions API over Charges API"* and *"default to latest SDK versions."*

You're not just documenting for humans anymore — you're **coaching the AI** that will answer questions about your product.

---

# docusaurus-plugin-llms

A plugin that generates llms.txt automatically from your Docusaurus site.

```bash
npm install docusaurus-plugin-llms
```

```js
// docusaurus.config.js
plugins: [
  [
    "docusaurus-plugin-llms",
    {
      generateLLMsTxt: true,
      generateLLMsFullTxt: true,
      docsDir: "docs",
    },
  ],
];
```

Zero-config works too — sensible defaults out of the box.

---

# Why this matters for doc writers

**Your docs are already being consumed by AI** — users paste them into ChatGPT, Claude, Copilot. You might as well make that experience good.

**Better AI answers = fewer support tickets** — When an LLM can read your docs properly, it gives better answers about your product.

**It's low effort** — One plugin, one build step. The docs you've already written do the work.

**You control the narrative** — Structured llms.txt means you decide what AI sees, in what order, with what emphasis.

---

# Beyond Docusaurus

The llms.txt standard isn't framework-specific. Options exist for:

- **MkDocs** — mkdocs-llmstxt
- **Sphinx** — sphinx-llmstxt
- **Custom sites** — Generate the files in your build pipeline

Or just write `llms.txt` by hand — it's markdown. Point it at your most important pages.

The key principle: **treat AI as a first-class consumer of your documentation.**
