import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { getTalk } from "@/lib/talks";

function stripQrSyntax(text: string): string {
  return text.replace(/\{\{qr:([^|}]+)(?:\|([^}]*))?\}\}/g, (_match, url, label) =>
    label ? `${label}: ${url}` : url,
  );
}

function markdownToPlainLines(md: string): { text: string; isBullet: boolean }[] {
  const lines = md.split("\n");
  const result: { text: string; isBullet: boolean }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    let text = bulletMatch ? bulletMatch[1] : trimmed;

    // Strip inline markdown
    text = text
      .replace(/\*\*(.*?)\*\*/g, "$1")
      .replace(/\*(.*?)\*/g, "$1")
      .replace(/`(.*?)`/g, "$1")
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");

    text = stripQrSyntax(text);

    result.push({ text, isBullet: !!bulletMatch });
  }

  return result;
}

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const talk = getTalk(slug);

  if (!talk) {
    return NextResponse.json({ error: "Talk not found" }, { status: 404 });
  }

  const pptx = new PptxGenJS();
  pptx.title = talk.title;
  if (talk.subtitle) pptx.subject = talk.subtitle;
  pptx.layout = "LAYOUT_WIDE";

  // Title slide
  const titleSlide = pptx.addSlide();
  titleSlide.addText(talk.title, {
    x: 0.5,
    y: 1.5,
    w: "90%",
    fontSize: 36,
    bold: true,
    color: "1a1a1a",
    align: "center",
  });
  if (talk.subtitle) {
    titleSlide.addText(talk.subtitle, {
      x: 0.5,
      y: 3.0,
      w: "90%",
      fontSize: 20,
      color: "666666",
      align: "center",
    });
  }

  // Content slides
  for (const slide of talk.slides) {
    const s = pptx.addSlide();

    let contentY = 0.5;

    if (slide.title) {
      s.addText(slide.title, {
        x: 0.5,
        y: 0.3,
        w: "90%",
        fontSize: 28,
        bold: true,
        color: "1a1a1a",
      });
      contentY = 1.2;
    }

    if (slide.body) {
      const lines = markdownToPlainLines(slide.body);
      const textObjects: PptxGenJS.TextProps[] = lines.map((line) => ({
        text: line.text,
        options: {
          fontSize: 18,
          color: "333333",
          bullet: line.isBullet ? { indent: 0.3 } : false,
          breakType: "break" as const,
          paraSpaceAfter: 6,
        },
      }));

      if (textObjects.length > 0) {
        s.addText(textObjects, {
          x: 0.5,
          y: contentY,
          w: "90%",
          h: 5.5 - contentY,
          valign: "top",
        });
      }
    }
  }

  const buffer = (await pptx.write({ outputType: "nodebuffer" })) as Buffer;

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type":
        "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "Content-Disposition": `attachment; filename="${slug}.pptx"`,
    },
  });
}
