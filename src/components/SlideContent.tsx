"use client";

import { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { QRCode } from "./QRCode";
import styles from "./SlideContent.module.scss";

interface SlideContentProps {
  markdown: string;
}

const QR_PATTERN = /\{\{qr:(.*?)(?:\|(.*?))?\}\}/g;

function renderWithQRCodes(markdown: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = QR_PATTERN.exec(markdown)) !== null) {
    const before = markdown.slice(lastIndex, match.index);
    if (before) {
      parts.push(
        <ReactMarkdown key={`md-${lastIndex}`}>{before}</ReactMarkdown>,
      );
    }
    parts.push(
      <QRCode key={`qr-${match.index}`} url={match[1]} label={match[2]} />,
    );
    lastIndex = match.index + match[0].length;
  }

  const remaining = markdown.slice(lastIndex);
  if (remaining) {
    parts.push(
      <ReactMarkdown key={`md-${lastIndex}`}>{remaining}</ReactMarkdown>,
    );
  }

  return parts;
}

export function SlideContent({ markdown }: SlideContentProps) {
  const hasQR = markdown.includes("{{qr:");

  return (
    <div className={styles.content}>
      {hasQR ? (
        renderWithQRCodes(markdown)
      ) : (
        <ReactMarkdown>{markdown}</ReactMarkdown>
      )}
    </div>
  );
}
