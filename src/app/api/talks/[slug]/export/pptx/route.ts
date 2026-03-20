import { NextRequest, NextResponse } from "next/server";
import PptxGenJS from "pptxgenjs";
import { getTalk } from "@/lib/talks";
import { markdownToPlainLines } from "@/lib/markdown-utils";

const COLORS = {
  bg: "FFFDF3",
  bgSecondary: "FFFAE1",
  fg: "333333",
  fgSecondary: "817365",
  accent: "FF7070",
  heading: "4B5F5F",
  border: "D7D1B1",
};

const FONTS = {
  heading: "Georgia",
  body: "Courier New",
};

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
  titleSlide.background = { color: COLORS.bg };

  // Accent bar at top
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 0,
    y: 0,
    w: "100%",
    h: 0.06,
    fill: { color: COLORS.accent },
  });

  titleSlide.addText(talk.title, {
    x: 1,
    y: 1.5,
    w: "80%",
    fontSize: 36,
    bold: true,
    color: COLORS.heading,
    fontFace: FONTS.heading,
    align: "left",
  });

  if (talk.subtitle) {
    titleSlide.addText(talk.subtitle, {
      x: 1,
      y: 3.2,
      w: "80%",
      fontSize: 18,
      color: COLORS.fgSecondary,
      fontFace: FONTS.body,
      align: "left",
    });
  }

  // Decorative bottom border
  titleSlide.addShape(pptx.ShapeType.rect, {
    x: 1,
    y: 4.2,
    w: 3,
    h: 0.04,
    fill: { color: COLORS.border },
  });

  // Content slides
  for (const slide of talk.slides) {
    const s = pptx.addSlide();
    s.background = { color: COLORS.bg };

    // Accent bar at top
    s.addShape(pptx.ShapeType.rect, {
      x: 0,
      y: 0,
      w: "100%",
      h: 0.06,
      fill: { color: COLORS.accent },
    });

    let contentY = 0.6;

    if (slide.title) {
      s.addText(slide.title, {
        x: 1,
        y: 0.4,
        w: "80%",
        fontSize: 28,
        bold: true,
        color: COLORS.heading,
        fontFace: FONTS.heading,
      });

      // Underline for heading
      s.addShape(pptx.ShapeType.rect, {
        x: 1,
        y: 1.15,
        w: 2,
        h: 0.03,
        fill: { color: COLORS.accent },
      });

      contentY = 1.5;
    }

    if (slide.body) {
      const lines = markdownToPlainLines(slide.body);
      const textObjects: PptxGenJS.TextProps[] = lines.map((line) => ({
        text: line.text,
        options: {
          fontSize: 16,
          color: COLORS.fg,
          fontFace: FONTS.body,
          bullet: line.isBullet
            ? { indent: 0.3, color: COLORS.accent }
            : false,
          breakType: "break" as const,
          paraSpaceAfter: 8,
        },
      }));

      if (textObjects.length > 0) {
        s.addText(textObjects, {
          x: 1,
          y: contentY,
          w: "78%",
          h: 5.5 - contentY,
          valign: "top",
          lineSpacingMultiple: 1.4,
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
