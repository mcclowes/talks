import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { getTalk } from "@/lib/talks";
import { stripQrSyntax, stripInlineMarkdown } from "@/lib/markdown-utils";

function docToBuffer(doc: PDFKit.PDFDocument): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    doc.on("data", (chunk: Uint8Array) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
    doc.end();
  });
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
    margins: { top: 50, bottom: 50, left: 50, right: 50 },
    bufferPages: true,
  });

  const pageWidth = doc.page.width - 100;

  // Title slide
  doc.fontSize(32).font("Helvetica-Bold");
  doc.text(talk.title, 50, 120, { width: pageWidth, align: "center" });

  if (talk.subtitle) {
    doc.moveDown(0.5);
    doc.fontSize(18).font("Helvetica").fillColor("#666666");
    doc.text(talk.subtitle, 50, doc.y, { width: pageWidth, align: "center" });
    doc.fillColor("#000000");
  }

  // Content slides
  for (const slide of talk.slides) {
    doc.addPage();
    let y = 50;

    if (slide.title) {
      doc.fontSize(24).font("Helvetica-Bold");
      doc.text(slide.title, 50, y, { width: pageWidth });
      y = doc.y + 12;
    }

    if (slide.body) {
      const bodyText = stripQrSyntax(slide.body);
      const lines = bodyText.split("\n");

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed) {
          y += 6;
          continue;
        }

        if (y > doc.page.height - 60) {
          doc.addPage();
          y = 50;
        }

        if (trimmed.startsWith("## ")) {
          doc.fontSize(18).font("Helvetica-Bold");
          doc.text(stripInlineMarkdown(trimmed.replace(/^##\s+/, "")), 50, y, {
            width: pageWidth,
          });
          y = doc.y + 8;
          continue;
        }

        const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
        const text = stripInlineMarkdown(bulletMatch ? bulletMatch[1] : trimmed);
        const xOffset = bulletMatch ? 70 : 50;
        const textWidth = bulletMatch ? pageWidth - 20 : pageWidth;

        doc.fontSize(14).font("Helvetica");

        if (bulletMatch) {
          doc.text("\u2022", 55, y);
        }

        doc.text(text, xOffset, y, { width: textWidth });
        y = doc.y + 4;
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
