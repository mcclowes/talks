import fs from "fs";
import path from "path";
import matter from "gray-matter";

const TALKS_DIR = path.join(process.cwd(), "data/talks");

const VALID_SLUG = /^[a-z0-9_][a-z0-9_-]*$/i;

function isValidSlug(slug: string): boolean {
  return VALID_SLUG.test(slug) && !slug.includes("..") && !slug.includes("/");
}

export interface TalkMeta {
  slug: string;
  title: string;
  subtitle?: string;
  date?: string;
  tags?: string[];
}

export interface TalkSlide {
  title: string;
  body: string;
  section?: string;
}

export interface Talk extends TalkMeta {
  slides: TalkSlide[];
}

interface TalkEntry {
  slug: string;
  type: "file" | "directory";
}

function getTalkEntries(): TalkEntry[] {
  if (!fs.existsSync(TALKS_DIR)) return [];

  return fs.readdirSync(TALKS_DIR).reduce<TalkEntry[]>((entries, name) => {
    const fullPath = path.join(TALKS_DIR, name);
    const stat = fs.statSync(fullPath);

    if (stat.isFile() && name.endsWith(".md")) {
      entries.push({ slug: name.replace(/\.md$/, ""), type: "file" });
    } else if (
      stat.isDirectory() &&
      fs.existsSync(path.join(fullPath, "index.md"))
    ) {
      entries.push({ slug: name, type: "directory" });
    }

    return entries;
  }, []);
}

export function getTalkSlugs(): string[] {
  return getTalkEntries().map((e) => e.slug);
}

function readFrontmatter(
  entry: TalkEntry,
): { data: Record<string, unknown>; content: string } | null {
  try {
    if (entry.type === "file") {
      const raw = fs.readFileSync(
        path.join(TALKS_DIR, `${entry.slug}.md`),
        "utf-8",
      );
      return matter(raw);
    }

    const indexPath = path.join(TALKS_DIR, entry.slug, "index.md");
    const raw = fs.readFileSync(indexPath, "utf-8");
    return matter(raw);
  } catch {
    return null;
  }
}

export function getAllTalks(): TalkMeta[] {
  return getTalkEntries().reduce<TalkMeta[]>((talks, entry) => {
    const result = readFrontmatter(entry);
    if (!result) return talks;
    const data = result.data;
    talks.push({
      slug: entry.slug,
      title: (data.title as string) || entry.slug,
      subtitle: data.subtitle as string | undefined,
      date: data.date as string | undefined,
      tags: data.tags as string[] | undefined,
    });
    return talks;
  }, []);
}

export function getTalk(slug: string): Talk | null {
  if (!isValidSlug(slug)) return null;

  const entry = getTalkEntries().find((e) => e.slug === slug);
  if (!entry) return null;

  const result = readFrontmatter(entry);
  if (!result) return null;

  const { data } = result;
  let slides: TalkSlide[];

  if (entry.type === "file") {
    slides = parseSlides(result.content);
  } else {
    slides = loadDirectorySlides(slug, result.content);
  }

  return {
    slug,
    title: (data.title as string) || slug,
    subtitle: data.subtitle as string | undefined,
    date: data.date as string | undefined,
    tags: data.tags as string[] | undefined,
    slides,
  };
}

function loadDirectorySlides(
  slug: string,
  indexContent: string,
): TalkSlide[] {
  const dir = path.join(TALKS_DIR, slug);
  const sectionFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort();

  const indexSlides = parseSlides(indexContent);

  const sectionSlides = sectionFiles.flatMap((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    let content: string;
    let section: string | undefined;

    if (raw.trimStart().startsWith("---")) {
      try {
        const parsed = matter(raw);
        content = parsed.content.trim();
        section = parsed.data.section as string | undefined;
      } catch {
        content = raw.trim();
      }
    } else {
      content = raw.trim();
    }

    return parseSlides(content).map((slide) => ({
      ...slide,
      section,
    }));
  });

  return [...indexSlides, ...sectionSlides];
}

function parseSlides(content: string): TalkSlide[] {
  const sections = content
    .split(/^---$/m)
    .map((s) => s.trim())
    .filter(Boolean);

  return sections.map((section) => {
    const lines = section.split("\n");
    let title = "";
    let bodyStart = 0;

    if (lines[0]?.startsWith("# ")) {
      title = lines[0].replace(/^#+\s+/, "");
      bodyStart = 1;
    }

    const body = lines.slice(bodyStart).join("\n").trim();
    return { title, body };
  });
}
