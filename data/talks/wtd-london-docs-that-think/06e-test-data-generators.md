---
section: Skills & automation
---

# Docs that execute: test data generators

Your API docs describe request bodies, parameters, and sequences. But real-world usage is messy — complex payloads, dependencies between calls, specific ordering.

**What if your docs could generate the test data and run the calls for you?**

Give Claude your API docs and let it build a library of:

- **Data generators** — valid, realistic payloads for every endpoint
- **Execution sequences** — multi-step flows in the right order
- **Edge cases** — boundary values, optional fields, error scenarios

---

# The problem: complex API sequences

Some products require a precise chain of API calls — each depending on the last.

```
1. Create a corporate entity        → get corporateId
2. Create a managed account         → get accountId
3. KYB verification on the entity   → wait for approved
4. Create an authorised user        → get userId
5. KYC verification on the user     → wait for approved
6. Link user to account             → get credentials
7. Fund the account                 → ready to transact
```

Get the order wrong, miss a field, skip a step — the whole flow fails.

**Your docs describe this. But nobody reads seven pages of setup before trying the API.**

---

# Building an executable API library

Instead of hoping developers read the docs, ship them a library that does the work:

```typescript
// Generated from your API documentation
const generator = new TestDataGenerator();

// Each generator knows the required fields,
// valid values, and realistic defaults
const corporate = generator.corporate({
  name: "Acme Ltd",
  // everything else has sensible defaults
});

// Sequences know the order and pass IDs forward
const result = await executeSequence("onboard-corporate", {
  corporate,
  user: generator.authorisedUser(),
  funding: generator.deposit({ amount: 10000 }),
});
```

---

# How Claude builds this from your docs

1. **Feed Claude your API reference** — endpoint specs, field descriptions, enums, constraints
2. **It generates typed data factories** — every field gets a realistic default, required fields are enforced
3. **It maps the sequences** — reads your "getting started" guide and turns prose into executable steps
4. **It handles the plumbing** — IDs from step 1 flow into step 2, polling for async operations, retry logic

```bash
claude "Read the API docs in /docs/api-reference and the
  onboarding guide in /docs/guides/onboarding. Generate
  TypeScript test data generators and execution sequences
  for every flow described in the guides."
```

---

# Docs stay the source of truth

The generators are derived from your documentation — not hardcoded separately.

**When your API changes:**

1. Update the docs (you were going to anyway)
2. Regenerate the library
3. If the generators break, your docs are wrong or incomplete

This is the same "docs as tests" principle — but instead of testing that docs *read* correctly, you're testing that they *execute* correctly.

**Your documentation becomes the spec. The generators are the proof it works.**
