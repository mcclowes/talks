"use client";

import { ComponentPropsWithoutRef, ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { GitHubRepoCard } from "./GitHubRepoCard";
import { ImageZoom } from "./ImageZoom";
import { Mermaid } from "./Mermaid";
import { NpmPackageCard } from "./NpmPackageCard";
import { QRCode } from "./QRCode";
import styles from "./SlideContent.module.scss";
import presStyles from "./SlideContentPresentation.module.scss";

interface SlideContentProps {
  markdown: string;
  presentation?: boolean;
}

const QR_PATTERN = /\{\{qr:(.*?)(?:\|(.*?))?\}\}/g;
const GITHUB_PATTERN = /\{\{github:([\w./-]+)\}\}/g;
const NPM_PATTERN = /\{\{npm:([@\w./-]+)\}\}/g;
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

interface EmbedMatch {
  index: number;
  length: number;
  node: ReactNode;
}

function renderWithEmbeds(markdown: string): ReactNode[] {
  const matches: EmbedMatch[] = [];

  for (const match of markdown.matchAll(QR_PATTERN)) {
    matches.push({
      index: match.index!,
      length: match[0].length,
      node: <QRCode key={`qr-${match.index}`} url={match[1]} label={match[2]} />,
    });
  }

  for (const match of markdown.matchAll(GITHUB_PATTERN)) {
    matches.push({
      index: match.index!,
      length: match[0].length,
      node: <GitHubRepoCard key={`gh-${match.index}`} repo={match[1]} />,
    });
  }

  for (const match of markdown.matchAll(NPM_PATTERN)) {
    matches.push({
      index: match.index!,
      length: match[0].length,
      node: <NpmPackageCard key={`npm-${match.index}`} packageName={match[1]} />,
    });
  }

  matches.sort((a, b) => a.index - b.index);

  const parts: ReactNode[] = [];
  let lastIndex = 0;

  for (const m of matches) {
    const before = markdown.slice(lastIndex, m.index);
    if (before) {
      parts.push(renderMarkdown(before, `md-${lastIndex}`));
    }
    parts.push(m.node);
    lastIndex = m.index + m.length;
  }

  const remaining = markdown.slice(lastIndex);
  if (remaining) {
    parts.push(renderMarkdown(remaining, `md-${lastIndex}`));
  }

  return parts;
}

export function SlideContent({ markdown, presentation }: SlideContentProps) {
  const hasEmbeds =
    markdown.includes("{{qr:") ||
    markdown.includes("{{github:") ||
    markdown.includes("{{npm:");
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
        {hasEmbeds
          ? renderWithEmbeds(contentMarkdown)
          : renderMarkdown(contentMarkdown, "main")}
      </div>
    </div>
  );
}
