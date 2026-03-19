# Code review: talks

**Reviewer**: (Principal engineer, onboarding)
**Date**: 2026-03-19
**Verdict**: Needs significant work before this is maintainable or trustworthy.

---

## 1. Zero tests

The CLAUDE.md says "TDD where possible/relevant." The `package.json` has Vitest configured. There are **zero test files** in the entire `src/` directory.

This is the single biggest issue. Every problem below was discoverable by tests, and every fix below is unverifiable without them. The test infrastructure is set up and completely unused.

**What to test first (highest value)**:
- `parseSlides()` and `loadDirectoryContent()` in `talks.ts` — pure functions, easy to test, and the most logic-dense code in the project
- The `stripQrSyntax` and `stripInlineMarkdown` helpers in the export routes — they have regex edge cases (see below)
- The markdown export round-trip: parse a talk, export it, re-parse it, verify it matches

**Lesson**: If you add a test runner to `package.json` but write no tests, you've just added a dev dependency for nothing. The value of TDD is that tests exist *before* the code is considered done, not as a future aspiration.

---

## 2. `talks.ts` — repeated filesystem traversal

Every public function calls `getTalkEntries()`, which does a full `readdirSync` + `statSync` per entry. On the `getTalk()` path, `getTalkEntries()` is called **three times**: once in `getTalk()` itself, once via `readFrontmatter()`, and `readFrontmatter()` calls `getTalkEntries()` again internally.

```
getTalk(slug)
  → getTalkEntries()          // 1st
  → readFrontmatter(slug)
      → getTalkEntries()      // 2nd (to find the entry again)
```

This is `O(n)` directory reads per request for a lookup that should be `O(1)`. The fix is trivial: `readFrontmatter` should accept the already-found `TalkEntry` instead of re-discovering it.

**Lesson**: When you notice a function accepting a primitive (like `slug: string`) and then doing work to find the object it refers to — and the caller *already has* that object — pass the object instead of the identifier.

---

## 3. Regex bug in `SlideContent.tsx` — global regex with `exec()` loop

```typescript
const QR_PATTERN = /\{\{qr:(.*?)(?:\|(.*?))?\}\}/g;
```

This regex is defined as a **module-level constant** with the `g` (global) flag, then used in `renderWithQRCodes()` via `QR_PATTERN.exec()`. In JavaScript, a global regex is **stateful** — it remembers its `lastIndex` between calls. If `renderWithQRCodes` is called, runs to completion, and the regex finishes cleanly, it resets. But if the component re-renders between exec calls, or if React's concurrent mode interrupts rendering, you can get stale state.

More practically: if the regex somehow doesn't fully exhaust (e.g., an exception mid-loop), `lastIndex` stays set and the next render **skips matches**.

**Fix**: Either create the regex inside the function (not at module scope), or use `String.prototype.matchAll()` which doesn't mutate the regex.

**Lesson**: Never store a global regex as a module-level constant if you use `.exec()` in a loop. The statefulness of `lastIndex` is one of JavaScript's most famous footguns.

---

## 4. Export routes — duplicated markdown stripping logic

`stripQrSyntax` is copy-pasted identically into `pdf/route.ts` and `pptx/route.ts`. `stripInlineMarkdown` is duplicated too (written slightly differently — inline in the PPTX route vs. a named function in the PDF route).

When you inevitably need to handle a new markdown pattern (e.g., `~~strikethrough~~`, `### headings`, numbered lists `1. item`), you'll need to find and update every copy. This is how bugs diverge between export formats.

**Fix**: Extract a shared `src/lib/markdown-utils.ts` with `stripQrSyntax`, `stripInlineMarkdown`, and `markdownToPlainLines`.

**Lesson**: If you copy-paste a function, that's a signal to extract it. The second copy is the trigger, not the third.

---

## 5. Export routes — incomplete markdown handling

The markdown strippers handle bold, italic, inline code, and links. They miss:

- `~~strikethrough~~`
- `### h3` and deeper headings (PDF only handles `##`)
- Numbered lists (`1. item`) — treated as plain text
- Images (`![alt](url)`) — silently render as raw markdown
- HTML entities and inline HTML
- Nested formatting (`**bold _and italic_**`)
- Code blocks (triple backtick) — the line-by-line processing will try to bullet-ify lines inside a fenced code block

That last one is a real bug: if a talk has a code example with a line starting with `- `, the PDF/PPTX export will format it as a bullet point.

**Lesson**: Parsing markdown with regex is inherently fragile. If you're going to do it, document the known limitations. Better yet, use a proper AST parser (like `remark`) to walk the tree and emit plain text.

---

## 6. PDF export silently truncates slides

```typescript
if (y > doc.page.height - 60) break;  // pdf/route.ts:82
```

If a slide has more content than fits on one page, the export **silently drops the rest**. No page break, no continuation, no warning. A presenter who exports their talk to PDF and prints it will have missing content with no indication.

**Fix**: At minimum, call `doc.addPage()` and reset `y` instead of `break`. Or document this as a known limitation.

**Lesson**: Silent data loss is worse than a crash. If you can't handle overflow properly, at least make it visible (e.g., add a "[content truncated]" note).

---

## 7. Security: path traversal in slug parameters

All three export routes and the main page do:

```typescript
const { slug } = await params;
const talk = getTalk(slug);
```

Inside `getTalk`, the slug is used in `path.join(TALKS_DIR, slug, "index.md")` and `path.join(TALKS_DIR, `${slug}.md`)`. If Next.js passes through a slug like `../../etc/passwd`, `path.join` will happily resolve it.

In practice, Next.js route params are URL-decoded but the static generation via `generateStaticParams` constrains the page route. However, the **API routes** (`/api/talks/[slug]/export/*`) are dynamic and don't have this constraint. The `getTalkEntries()` lookup provides *some* protection (it checks if the slug matches an existing entry), but the defense is accidental, not intentional.

**Fix**: Validate the slug at the boundary: reject anything containing `/`, `..`, or `\`.

**Lesson**: Never trust path segments from URLs. Even if framework routing *currently* prevents exploitation, defense in depth means validating at the point of use.

---

## 8. `Content-Disposition` header injection

```typescript
`attachment; filename="${slug}.pdf"`
```

The slug comes from URL params and is interpolated directly into a header value. A slug containing `"` or newline characters could break the header parsing or inject additional headers. This is a low-severity issue given the slug validation from directory listing, but it's still sloppy.

**Fix**: Sanitize the filename or use RFC 5987 encoding (`filename*=UTF-8''...`).

---

## 9. `TalkPageClient` derives slug from pathname, not from props

```typescript
const slug = pathname.split("/").pop();  // TalkPageClient.tsx:10
```

The parent server component (`[slug]/page.tsx`) already has the slug from params. Instead of passing it as a prop, the client component re-derives it by splitting the URL pathname. This is fragile — if the URL structure ever changes (e.g., nested routes like `/talks/my-talk`), this breaks silently.

**Fix**: Pass `slug` as a prop from the parent.

**Lesson**: Don't derive from the URL what you can pass as a prop. Props are explicit and type-checked; URL parsing is implicit and stringly-typed.

---

## 10. Presentation mode initializes from search params only once

```typescript
const initialSlide = Math.min(
  Math.max(0, Number(searchParams.get("slide") || 1) - 1),
  slides.length - 1,
);
const [current, setCurrent] = useState(initialSlide);
```

The `searchParams` value is read once to initialize `useState`. If the user navigates to `?slide=5` via the browser (e.g., back button, shared link), the component won't update because `useState` ignores subsequent changes to its initial value. The component does sync *outward* (updating the URL when `current` changes), but not *inward*.

This means browser back/forward through slide changes is broken.

**Lesson**: If you sync state with the URL, it needs to be bidirectional. Either use the URL as the source of truth (derive state from it on every render) or handle external URL changes via an effect.

---

## 11. `PresentationMode` — URL update bypasses Next.js router

```typescript
window.history.replaceState(null, "", url.pathname + url.search);
```

The component uses `window.history.replaceState` to update the URL but uses `router.push` when exiting. This inconsistency means Next.js router state and actual browser state can diverge. If other parts of the app depend on Next.js router events, they won't fire during slide navigation.

---

## 12. Accessibility gaps

- **Keyboard navigation in presentation mode**: Space bar advances slides, but Space also activates focused buttons. If a user tabs to the "Exit" button and presses Space, the event handler calls `goNext()` *and* the button click fires `exit()`. The `e.preventDefault()` on Space prevents the default scroll but doesn't stop the button activation because the keydown handler is on `window`, not the button.
- **No focus management**: When entering presentation mode, focus isn't moved to the presentation container. Screen reader users have no indication that the view changed.
- **Progress dots**: Using `data-active` is not communicated to assistive technology. Should use `aria-current="step"` or similar.
- **No slide landmark/region**: The slide content area has no ARIA role or live region, so slide changes aren't announced.

**Lesson**: Accessibility isn't optional. Test with keyboard-only navigation and a screen reader at least once.

---

## 13. Home page has no error boundary and no loading state

`getAllTalks()` does synchronous filesystem I/O in a server component. If the `data/talks/` directory doesn't exist, `getTalkEntries` returns `[]` which is handled. But if a malformed frontmatter file throws from `gray-matter`, the entire page crashes with an unhandled exception and the user sees Next.js's default error page.

**Fix**: Wrap `readFrontmatter` in a try/catch so one bad talk file doesn't take down the entire listing.

---

## 14. Fragile slide splitting

```typescript
const sections = content.split(/^---$/m)
```

This splits on `---` only when it's the entire line. But YAML frontmatter *also* uses `---`. If `gray-matter` doesn't fully strip the closing `---` of frontmatter, or if a talk's content contains `---` in a code block, you'll get phantom slide breaks.

A fenced code block like:

````markdown
```yaml
---
key: value
---
```
````

...will split into three slides instead of one. There's no awareness of fenced code block context.

**Lesson**: Context-free string splitting on delimiter patterns is fragile when the content can contain those delimiters in other contexts. A proper parser would track code fence state.

---

## 15. Title extraction is inconsistent with markdown spec

```typescript
if (lines[0]?.startsWith("# ")) {
  title = lines[0].replace(/^#+\s+/, "");
```

The `startsWith("# ")` check only matches `# ` (h1), but the replacement regex `^#+\s+` strips *any* heading level. So if someone writes `## Subtitle` as the first line, it won't be detected as a title (correctly), but if they write `# My Title` with trailing `## `, the regex would strip too aggressively. More importantly, inline markdown in titles (`# **Bold** title`) is preserved as raw markdown in the `title` field, but the export routes don't strip it when rendering titles.

---

## 16. No `vitest.config.ts`

Vitest is in `devDependencies` and the scripts reference it, but there's no config file. This means Vitest is running with defaults — no path alias resolution (`@/*` won't work in tests), no React plugin for component tests. The first time someone tries to write a test importing from `@/lib/talks`, it'll fail with a module resolution error.

**Lesson**: If a tool requires configuration to work with your project, configure it *when you add it*, not when you first need it. An unconfigured tool is a trap for the next person.

---

## 17. Three Google Fonts loaded for minimal use

The layout loads Roboto Mono (all weights), Inknut Antiqua (5 weights), and Poppins (5 weights). That's a significant font payload. Checking the SCSS, only `--font-mono` is used on `body`, `--font-serif` on headings, and `--font-sans` is defined but **never referenced in any SCSS file**.

Poppins is loaded but unused. That's wasted bandwidth on every page load.

**Lesson**: Audit your imports. Unused dependencies — whether npm packages or font loads — are performance costs for zero benefit.

---

## 18. No error handling in export routes for generation failures

If `PDFDocument` or `PptxGenJS` throws during generation (e.g., out of memory, invalid data), the API routes will return a 500 with Next.js's default error body. There's no try/catch around the generation logic.

---

## 19. The markdown export doesn't round-trip

The markdown export reconstructs frontmatter from parsed data:

```typescript
`title: "${talk.title}"`
```

If the original title contained a `"` character, the exported YAML is broken. No escaping is applied to any frontmatter value. The tags array construction has the same issue.

Additionally, the export re-joins slides with `---`, but the original content may have had extra whitespace, comments, or formatting that's lost in the parse-then-export cycle. This means export-then-reimport is lossy.

---

## 20. CSS concerns

- **`--fg-primary` referenced but never defined**: In `page.module.scss:55`, the export button hover state references `var(--fg-primary)` which doesn't exist in `globals.scss`. This means the hover color silently falls back to the initial value (likely transparent or inherited), making the text potentially invisible on hover.
- **`navButton` is `display: none` by default** and only shown on mobile (`max-width: 640px`). Desktop users have *no* clickable navigation — they must use keyboard shortcuts. This is undiscoverable. There's no onscreen hint that arrow keys work.
- **No `prefers-reduced-motion`**: All transitions run regardless of user motion preferences.
- **Magic numbers everywhere**: Font sizes, padding, margins — none are derived from a scale or documented. The presentation mode uses `em` units scaled by a JS-controlled `fontSize`, but the controls bar uses `rem`, so font scaling doesn't affect the UI chrome. That's probably intentional but isn't documented.

---

## Summary of priorities

| Priority | Issue | Effort |
|----------|-------|--------|
| **P0** | Write tests (at minimum for `talks.ts` and markdown stripping) | Medium |
| **P0** | Fix `--fg-primary` undefined CSS variable (broken hover state) | Trivial |
| **P1** | Extract shared markdown utils from export routes | Small |
| **P1** | Fix slug-from-pathname derivation — pass as prop | Trivial |
| **P1** | Add slug validation (path traversal) | Small |
| **P1** | Fix PDF silent truncation | Small |
| **P1** | Fix global regex statefulness in `SlideContent` | Trivial |
| **P2** | Add `vitest.config.ts` with path aliases | Small |
| **P2** | Remove unused Poppins font | Trivial |
| **P2** | Fix markdown export YAML escaping | Small |
| **P2** | Add error boundaries / try-catch for malformed talks | Small |
| **P2** | Bidirectional URL sync in presentation mode | Medium |
| **P3** | Accessibility improvements | Medium |
| **P3** | Reduce repeated filesystem traversal | Small |
| **P3** | Handle code blocks in slide splitting / export stripping | Medium |

---

*This codebase has the bones of a decent tool, but it was shipped without the discipline that makes code trustworthy: no tests, no input validation, duplicated logic across export routes, and several silent-failure modes. The fixes are mostly straightforward — the hard part is building the habit of catching these before they ship.*
