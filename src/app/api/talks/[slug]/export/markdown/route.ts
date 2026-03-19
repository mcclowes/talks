import { NextRequest, NextResponse } from "next/server";
import { getTalk } from "@/lib/talks";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const talk = getTalk(slug);

  if (!talk) {
    return NextResponse.json({ error: "Talk not found" }, { status: 404 });
  }

  const frontmatter = [
    "---",
    `title: "${talk.title}"`,
    talk.subtitle ? `subtitle: "${talk.subtitle}"` : null,
    talk.date ? `date: "${talk.date}"` : null,
    talk.tags?.length ? `tags: [${talk.tags.map((t) => `"${t}"`).join(", ")}]` : null,
    "---",
  ]
    .filter(Boolean)
    .join("\n");

  const slides = talk.slides
    .map((slide) => {
      const parts: string[] = [];
      if (slide.title) parts.push(`# ${slide.title}`);
      if (slide.body) parts.push(slide.body);
      return parts.join("\n");
    })
    .join("\n\n---\n\n");

  const markdown = `${frontmatter}\n\n${slides}\n`;

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": `attachment; filename="${slug}.md"`,
    },
  });
}
