export function stripQrSyntax(text: string): string {
  return text.replace(
    /\{\{qr:([^|}]+)(?:\|([^}]*))?\}\}/g,
    (_match, url, label) => (label ? `${label}: ${url}` : url),
  );
}

export function stripInlineMarkdown(text: string): string {
  return text
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/\*(.*?)\*/g, "$1")
    .replace(/~~(.*?)~~/g, "$1")
    .replace(/`(.*?)`/g, "$1")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1");
}

export function markdownToPlainLines(
  md: string,
): { text: string; isBullet: boolean }[] {
  const lines = md.split("\n");
  const result: { text: string; isBullet: boolean }[] = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const bulletMatch = trimmed.match(/^[-*]\s+(.*)/);
    let text = bulletMatch ? bulletMatch[1] : trimmed;

    text = stripInlineMarkdown(text);
    text = stripQrSyntax(text);

    result.push({ text, isBullet: !!bulletMatch });
  }

  return result;
}
