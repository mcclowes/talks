import { describe, it, expect, beforeEach, afterEach } from "vitest";
import fs from "fs";
import path from "path";
import { getTalk, getAllTalks, getTalkSlugs } from "./talks";

const TALKS_DIR = path.join(process.cwd(), "data/talks");
const TEST_DIR = path.join(TALKS_DIR, "__test-talk__");
const TEST_FILE = path.join(TALKS_DIR, "__test-single__.md");

beforeEach(() => {
  fs.mkdirSync(TEST_DIR, { recursive: true });
});

afterEach(() => {
  fs.rmSync(TEST_DIR, { recursive: true, force: true });
  if (fs.existsSync(TEST_FILE)) fs.unlinkSync(TEST_FILE);
});

describe("getTalkSlugs", () => {
  it("includes single-file talks", () => {
    fs.writeFileSync(TEST_FILE, "---\ntitle: Test\n---\n# Slide 1\nHello");
    expect(getTalkSlugs()).toContain("__test-single__");
  });

  it("includes directory talks with index.md", () => {
    fs.writeFileSync(path.join(TEST_DIR, "index.md"), "---\ntitle: Dir\n---\n");
    expect(getTalkSlugs()).toContain("__test-talk__");
  });

  it("excludes directories without index.md", () => {
    // TEST_DIR exists but has no index.md
    expect(getTalkSlugs()).not.toContain("__test-talk__");
  });
});

describe("getTalk", () => {
  it("parses a single-file talk with frontmatter and slides", () => {
    fs.writeFileSync(
      TEST_FILE,
      "---\ntitle: My Talk\nsubtitle: A subtitle\n---\n# Slide 1\nBody 1\n\n---\n\n# Slide 2\nBody 2",
    );

    const talk = getTalk("__test-single__");
    expect(talk).not.toBeNull();
    expect(talk!.title).toBe("My Talk");
    expect(talk!.subtitle).toBe("A subtitle");
    expect(talk!.slides).toHaveLength(2);
    expect(talk!.slides[0].title).toBe("Slide 1");
    expect(talk!.slides[0].body).toBe("Body 1");
    expect(talk!.slides[1].title).toBe("Slide 2");
  });

  it("parses directory talks by merging section files", () => {
    fs.writeFileSync(
      path.join(TEST_DIR, "index.md"),
      "---\ntitle: Dir Talk\n---\n# Title Slide\nIntro",
    );
    fs.writeFileSync(
      path.join(TEST_DIR, "01-section.md"),
      "# Section 1\nContent",
    );

    const talk = getTalk("__test-talk__");
    expect(talk).not.toBeNull();
    expect(talk!.title).toBe("Dir Talk");
    expect(talk!.slides.length).toBeGreaterThanOrEqual(2);
  });

  it("returns null for nonexistent slug", () => {
    expect(getTalk("nonexistent-talk-xyz")).toBeNull();
  });

  it("rejects path traversal slugs", () => {
    expect(getTalk("../../../etc/passwd")).toBeNull();
    expect(getTalk("foo/bar")).toBeNull();
    expect(getTalk(".hidden")).toBeNull();
  });

  it("handles slides without titles", () => {
    fs.writeFileSync(
      TEST_FILE,
      "---\ntitle: Test\n---\nNo heading here\n\n---\n\nAlso no heading",
    );

    const talk = getTalk("__test-single__");
    expect(talk!.slides[0].title).toBe("");
    expect(talk!.slides[0].body).toBe("No heading here");
  });

  it("uses slug as title when frontmatter has no title", () => {
    fs.writeFileSync(TEST_FILE, "---\n---\n# Slide\nBody");

    const talk = getTalk("__test-single__");
    expect(talk!.title).toBe("__test-single__");
  });
});

describe("getAllTalks", () => {
  it("returns metadata for all valid talks", () => {
    fs.writeFileSync(
      TEST_FILE,
      '---\ntitle: Listed\ntags: ["a", "b"]\n---\n# Slide\nBody',
    );

    const talks = getAllTalks();
    const testTalk = talks.find((t) => t.slug === "__test-single__");
    expect(testTalk).toBeDefined();
    expect(testTalk!.title).toBe("Listed");
    expect(testTalk!.tags).toEqual(["a", "b"]);
  });

  it("skips talks with malformed frontmatter gracefully", () => {
    fs.writeFileSync(TEST_FILE, "not valid yaml: {{{");

    // Should not throw
    const talks = getAllTalks();
    // The talk may or may not appear, but the function shouldn't crash
    expect(Array.isArray(talks)).toBe(true);
  });
});
