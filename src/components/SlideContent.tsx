"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageZoom } from "./ImageZoom";
import { Mermaid } from "./Mermaid";
import { QRCode } from "./QRCode";
import styles from "./SlideContent.module.scss";
import presStyles from "./SlideContentPresentation.module.scss";

interface SlideContentProps {
  markdown: string;
  presentation?: boolean;
}

const QR_PATTERN = /\{\{qr:(.*?)(?:\|(.*?))?\}\}/g;
const BG_PATTERN = /\{\{bg:(.*?)(?:\|(.*?))?\}\}/;
const IMAGE_RIGHT_PATTERN = /\{\{image-right:(.*?)(?:\|(.*?))?\}\}/;

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
  img({ src, alt }: ComponentPropsWithoutRef<"img">) {
    return <ImageZoom src={typeof src === "string" ? src : undefined} alt={alt} />;
  },
};

function renderMarkdown(content: string, key: string) {
  return (
    <ReactMarkdown key={key} remarkPlugins={[remarkGfm]} components={markdownComponents}>
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

export function SlideContent({ markdown, presentation }: SlideContentProps) {
  const hasQR = markdown.includes("{{qr:");
  const bgMatch = markdown.match(BG_PATTERN);
  const imageRightMatch = markdown.match(IMAGE_RIGHT_PATTERN);
  const bgSrc = bgMatch?.[1];
  const imageRightSrc = presentation ? imageRightMatch?.[1] : undefined;
  const imageRightAlt = imageRightMatch?.[2] || "";

  let contentMarkdown = markdown;
  if (bgMatch) contentMarkdown = contentMarkdown.replace(BG_PATTERN, "").trim();
  if (imageRightMatch)
    contentMarkdown = contentMarkdown.replace(IMAGE_RIGHT_PATTERN, "").trim();

  const classNames = [styles.content];
  if (presentation) {
    classNames.push(presStyles.presentation);
    if (imageRightSrc) classNames.push(presStyles.imageRight);
  }

  return (
    <div className={classNames.join(" ")}>
      {presentation && bgSrc && (
        <div className={presStyles.backgroundImage}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={bgSrc} alt="" aria-hidden="true" />
        </div>
      )}
      {imageRightSrc && (
        <div className={presStyles.imageRightPanel}>
          <ImageZoom src={imageRightSrc} alt={imageRightAlt} />
        </div>
      )}
      <div className={imageRightSrc ? presStyles.textPanel : undefined}>
        {hasQR
          ? renderWithQRCodes(contentMarkdown)
          : renderMarkdown(contentMarkdown, "main")}
      </div>
    </div>
  );
}
