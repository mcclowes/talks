"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import { Mermaid } from "./Mermaid";
import { QRCode } from "./QRCode";
import styles from "./SlideContent.module.scss";

interface SlideContentProps {
  markdown: string;
}

const QR_PATTERN = /\{\{qr:(.*?)(?:\|(.*?))?\}\}/g;

const markdownComponents = {
  code({ className, children, ...props }: ComponentPropsWithoutRef<"code">) {
    const match = /language-(\w+)/.exec(className || "");
    if (match?.[1] === "mermaid") {
      return <Mermaid chart={String(children).trim()} />;
    }
    return (
      <code className={className} {...props}>
        {children}
      </code>
    );
  },
};

function renderMarkdown(content: string, key: string) {
  return (
    <ReactMarkdown key={key} components={markdownComponents}>
      {content}
    </ReactMarkdown>
  );
}

function renderWithQRCodes(markdown: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of markdown.matchAll(QR_PATTERN)) {
    const before = markdown.slice(lastIndex, match.index);
    if (before) {
      parts.push(renderMarkdown(before, `md-${lastIndex}`));
    }
    parts.push(
      <QRCode key={`qr-${match.index}`} url={match[1]} label={match[2]} />,
    );
    lastIndex = match.index! + match[0].length;
  }

  const remaining = markdown.slice(lastIndex);
  if (remaining) {
    parts.push(renderMarkdown(remaining, `md-${lastIndex}`));
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
        renderMarkdown(markdown, "main")
      )}
    </div>
  );
}
