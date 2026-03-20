import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getTalk } from "@/lib/talks";
import { stripQrSyntax, stripInlineMarkdown } from "@/lib/markdown-utils";

const COLORS = {
  bg: "#FFFDF3",
  fg: "#333333",
  fgSecondary: "#817365",
  accent: "#FF7070",
  heading: "#4B5F5F",
  border: "#D7D1B1",
};

function docToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
}

function addAccentBar(doc: PDFKit.PDFDocument) {
  doc.save();
  doc.rect(0, 0, doc.page.width, 4).fill(COLORS.accent);
  doc.restore();
}

function addPageBackground(doc: PDFKit.PDFDocument) {
  doc.save();
  doc.rect(0, 0, doc.page.width, doc.page.height).fill(COLORS.bg);
  doc.restore();
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

  const doc = new PDFDocument({
    layout: "landscape",
    size: "A4",
    margins: { top: 60, bottom: 60, left: 72, right: 72 },
    bufferPages: true,
  });

  const pageWidth = doc.page.width - 144;
  const contentX = 72;

  // Title slide
  addPageBackground(doc);
  addAccentBar(doc);

  doc.fontSize(32).font("Helvetica-Bold").fillColor(COLORS.heading);
  doc.text(talk.title, contentX, 140, { width: pageWidth });

  if (talk.subtitle) {
    doc.moveDown(0.6);
    doc.fontSize(18).font("Courier").fillColor(COLORS.fgSecondary);
    doc.text(talk.subtitle, contentX, doc.y, { width: pageWidth });
  }

  // Decorative line under title
  doc
    .save()
    .moveTo(contentX, doc.y + 20)
    .lineTo(contentX + 180, doc.y + 20)
    .lineWidth(2)
    .strokeColor(COLORS.border)
    .stroke()
    .restore();

  // Content slides
  for (const slide of talk.slides) {
    doc.addPage();
    addPageBackground(doc);
    addAccentBar(doc);

    let y = 30;

    if (slide.title) {
      doc.fontSize(24).font("Helvetica-Bold").fillColor(COLORS.heading);
      doc.text(slide.title, contentX, y, { width: pageWidth });
      y = doc.y + 4;

      // Accent underline
      doc
        .save()
        .moveTo(contentX, y)
        .lineTo(contentX + 120, y)
        .lineWidth(2)
        .strokeColor(COLORS.accent)
        .stroke()
        .restore();

      y += 16;
    }

    if (slide.body) {
      const bodyText = stripQrSyntax(slide.body);
      const lines = bodyText.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          y += 8;
          continue;
        }

        if (y > doc.page.height - 70) {
          doc.addPage();
          addPageBackground(doc);
          addAccentBar(doc);
          y = 30;
        }

        if (trimmed.startsWith("## ")) {
          doc.fontSize(18).font("Helvetica-Bold").fillColor(COLORS.heading);
          doc.text(stripInlineMarkdown(trimmed.replace(/^##\s+/, "")), contentX, y, {
            width: pageWidth,
          });
          y = doc.y + 10;
          continue;
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
        const text = stripInlineMarkdown(bulletMatch ? bulletMatch[1] : trimmed);
        const xOffset = bulletMatch ? contentX + 20 : contentX;
        const textWidth = bulletMatch ? pageWidth - 20 : pageWidth;

        doc.fontSize(14).font("Courier").fillColor(COLORS.fg);

        if (bulletMatch) {
          doc.fillColor(COLORS.accent).text("\u2022", contentX + 4, y);
          doc.fillColor(COLORS.fg);
        }

        doc.text(text, xOffset, y, { width: textWidth, lineGap: 4 });
        y = doc.y + 6;
      }
    }
  }

  const buffer = await docToBuffer(doc);

  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${slug}.pdf"`,
    },
  });
}
