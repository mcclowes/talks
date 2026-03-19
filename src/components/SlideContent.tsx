"use client";

import ReactMarkdown from "react-markdown";
import styles from "./SlideContent.module.scss";

interface SlideContentProps {
  markdown: string;
}

export function SlideContent({ markdown }: SlideContentProps) {
  return (
    <div className={styles.content}>
      <ReactMarkdown>{markdown}</ReactMarkdown>
    </div>
  );
}
