import fs from "fs";
import path from "path";
import matter from "gray-matter";

const TALKS_DIR = path.join(process.cwd(), "data/talks");

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
  slug: string,
): { data: Record<string, unknown>; content: string } | null {
  const entry = getTalkEntries().find((e) => e.slug === slug);
  if (!entry) return null;

  if (entry.type === "file") {
    const raw = fs.readFileSync(path.join(TALKS_DIR, `${slug}.md`), "utf-8");
    return matter(raw);
  }

  const indexPath = path.join(TALKS_DIR, slug, "index.md");
  const raw = fs.readFileSync(indexPath, "utf-8");
  return matter(raw);
}

export function getAllTalks(): TalkMeta[] {
  return getTalkEntries().map((entry) => {
    const result = readFrontmatter(entry.slug);
    const data = result?.data ?? {};
    return {
      slug: entry.slug,
      title: (data.title as string) || entry.slug,
      subtitle: data.subtitle as string | undefined,
      date: data.date as string | undefined,
      tags: data.tags as string[] | undefined,
    };
  });
}

export function getTalk(slug: string): Talk | null {
  const entry = getTalkEntries().find((e) => e.slug === slug);
  if (!entry) return null;

  const result = readFrontmatter(slug);
  if (!result) return null;

  const { data } = result;
  let allContent: string;

  if (entry.type === "file") {
    allContent = result.content;
  } else {
    allContent = loadDirectoryContent(slug, result.content);
  }

  const slides = parseSlides(allContent);

  return {
    slug,
    title: (data.title as string) || slug,
    subtitle: data.subtitle as string | undefined,
    date: data.date as string | undefined,
    tags: data.tags as string[] | undefined,
    slides,
  };
}

function loadDirectoryContent(slug: string, indexContent: string): string {
  const dir = path.join(TALKS_DIR, slug);
  const sectionFiles = fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md") && f !== "index.md")
    .sort();

  const sections = sectionFiles.map((f) => {
    const raw = fs.readFileSync(path.join(dir, f), "utf-8");
    const { content } = matter(raw);
    return content.trim();
  });

  const parts = [indexContent.trim(), ...sections].filter(Boolean);
  return parts.join("\n\n---\n\n");
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
