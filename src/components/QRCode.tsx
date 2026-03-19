"use client";

import { QRCodeSVG } from "qrcode.react";
import styles from "./QRCode.module.scss";

interface QRCodeProps {
  url: string;
  label?: string;
  size?: number;
}

export function QRCode({ url, label, size = 180 }: QRCodeProps) {
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
