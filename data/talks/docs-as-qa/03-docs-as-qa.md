---
section: Docs as QA
---

# Rate limits

- Purpose
- Limit (calculation)
- How you'll be notified

---

# Rate limits docs

A real example from Codat's rate limits documentation:

- Third-party rate limits
- Codat rate limits (enforced by `api.codat.io`, returns `429`, includes `Retry-After` header)

---

# Client-based limits

- ACC (Active Connected Company): a company with an active, linked, and syncing connection
- 1,000 requests per day, or
- 100 requests per day per ACC, **whichever is greater**
- Resets daily at 00:00 UTC

---

# Company-based limits

- 1,000 requests per day, and
- 10 concurrent requests
- These limits represent a global request count
- Resets daily at 00:00 UTC

---

# Stinky

When docs are hard to write, something stinks.
