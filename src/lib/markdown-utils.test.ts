import { describe, it, expect } from "vitest";
import {
  stripQrSyntax,
  stripInlineMarkdown,
  markdownToPlainLines,
} from "./markdown-utils";

describe("stripQrSyntax", () => {
  it("replaces QR with label as 'label: url'", () => {
    expect(stripQrSyntax("{{qr:https://example.com|Sign up}}")).toBe(
      "Sign up: https://example.com",
    );
  });

  it("replaces QR without label as just the url", () => {
    expect(stripQrSyntax("{{qr:https://example.com}}")).toBe(
      "https://example.com",
    );
  });

  it("handles multiple QR codes in one string", () => {
    const input = "Try {{qr:https://a.com|A}} and {{qr:https://b.com}}";
    expect(stripQrSyntax(input)).toBe(
      "Try A: https://a.com and https://b.com",
    );
  });

  it("returns text unchanged when no QR codes present", () => {
    expect(stripQrSyntax("just plain text")).toBe("just plain text");
  });
});

describe("stripInlineMarkdown", () => {
  it("strips bold", () => {
    expect(stripInlineMarkdown("**bold**")).toBe("bold");
  });

  it("strips italic", () => {
    expect(stripInlineMarkdown("*italic*")).toBe("italic");
  });

  it("strips strikethrough", () => {
    expect(stripInlineMarkdown("~~deleted~~")).toBe("deleted");
  });

  it("strips inline code", () => {
    expect(stripInlineMarkdown("`code`")).toBe("code");
  });

  it("strips links, keeping text", () => {
    expect(stripInlineMarkdown("[click here](https://example.com)")).toBe(
      "click here",
    );
  });

  it("strips images, keeping alt text", () => {
    expect(stripInlineMarkdown("![alt text](image.png)")).toBe("alt text");
  });

  it("handles mixed formatting", () => {
    expect(
      stripInlineMarkdown("**bold** and *italic* with `code`"),
    ).toBe("bold and italic with code");
  });

  it("returns plain text unchanged", () => {
    expect(stripInlineMarkdown("no formatting")).toBe("no formatting");
  });
});

describe("markdownToPlainLines", () => {
  it("identifies bullet lines", () => {
    const result = markdownToPlainLines("- item one\n- item two");
    expect(result).toEqual([
      { text: "item one", isBullet: true },
      { text: "item two", isBullet: true },
    ]);
  });

  it("identifies non-bullet lines", () => {
    const result = markdownToPlainLines("plain line");
    expect(result).toEqual([{ text: "plain line", isBullet: false }]);
  });

  it("skips empty lines", () => {
    const result = markdownToPlainLines("line one\n\nline two");
    expect(result).toHaveLength(2);
  });

  it("strips markdown from bullet content", () => {
    const result = markdownToPlainLines("- **bold item**");
    expect(result).toEqual([{ text: "bold item", isBullet: true }]);
  });

  it("strips QR syntax from lines", () => {
    const result = markdownToPlainLines("{{qr:https://example.com|Link}}");
    expect(result).toEqual([
      { text: "Link: https://example.com", isBullet: false },
    ]);
  });

  it("handles asterisk bullets", () => {
    const result = markdownToPlainLines("* item");
    expect(result).toEqual([{ text: "item", isBullet: true }]);
  });
});
