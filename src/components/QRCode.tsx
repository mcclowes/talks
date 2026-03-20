"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./QRCode.module.scss";

interface QRCodeProps {
  url: string;
  label?: string;
  size?: number;
  presentation?: boolean;
}

export function QRCode({ url, label, size = 180, presentation }: QRCodeProps) {
  if (!presentation) {
    return (
      <div className={styles.linkBlock}>
        {label && <span className={styles.label}>{label}</span>}
        <a
          href={url}
          className={styles.link}
          target="_blank"
          rel="noopener noreferrer"
        >
          {url.replace(/^https?:\/\//, "")}
        </a>
      </div>
    );
  }

  return (
    <div className={styles.qrBlock}>
      <QRCodeSVG
        value={url}
        size={size}
        bgColor="transparent"
        fgColor="currentColor"
        level="M"
      />
      {label && <span className={styles.label}>{label}</span>}
      <a
        href={url}
        className={styles.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {url.replace(/^https?:\/\//, "")}
      </a>
    </div>
  );
}
