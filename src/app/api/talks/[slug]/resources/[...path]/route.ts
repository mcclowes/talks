import { NextRequest, NextResponse } from "next/server";
import { getTalkResourceContent } from "@/lib/talks";

const MIME_TYPES: Record<string, string> = {
  ".md": "text/markdown; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".ts": "text/plain; charset=utf-8",
  ".js": "text/plain; charset=utf-8",
  ".sh": "text/plain; charset=utf-8",
  ".yaml": "text/plain; charset=utf-8",
  ".yml": "text/plain; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string; path: string[] }> },
) {
  const { slug, path: pathSegments } = await params;
  const resourcePath = pathSegments.join("/");

  const result = getTalkResourceContent(slug, resourcePath);
  if (!result) {
    return NextResponse.json({ error: "Resource not found" }, { status: 404 });
  }

  const ext = "." + result.filename.split(".").pop()?.toLowerCase();
  const contentType = MIME_TYPES[ext] || "application/octet-stream";

  return new NextResponse(new Uint8Array(result.content), {
    headers: {
      "Content-Type": contentType,
    },
  });
}
