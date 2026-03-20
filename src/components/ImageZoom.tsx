"use client";

import { useState, useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "./ImageZoom.module.scss";

interface ImageZoomProps {
  src?: string;
  alt?: string;
}

export function ImageZoom({ src, alt }: ImageZoomProps) {
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [isOpen, close]);

  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={src}
        alt={alt || ""}
        onClick={() => setIsOpen(true)}
        className={styles.zoomable}
      />
      {isOpen &&
        createPortal(
          <div className={styles.overlay} onClick={close}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt || ""} />
          </div>,
          document.body
        )}
    </>
  );
}
