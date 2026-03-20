"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.scss";

interface TalkPageClientProps {
  slug: string;
}

export function TalkPageClient({ slug }: TalkPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [exportOpen, setExportOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const startPresentation = useCallback(() => {
    router.push(`${pathname}?mode=presentation`);
  }, [router, pathname]);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.metaKey && e.key === "Enter") {
        e.preventDefault();
        startPresentation();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [startPresentation]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setExportOpen(false);
      }
    }
    if (exportOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [exportOpen]);

  return (
    <div className={styles.actions}>
      <button
        className={styles.presentButton}
        onClick={startPresentation}
        title="Present"
        aria-label="Present"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
          <path d="M4 2.5v11l9-5.5L4 2.5z" />
        </svg>
        Present
      </button>

      <div className={styles.exportDropdown} ref={dropdownRef}>
        <button
          className={styles.exportToggle}
          onClick={() => setExportOpen(!exportOpen)}
          title="Export"
          aria-label="Export"
          aria-expanded={exportOpen}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 13h10" />
          </svg>
        </button>
        {exportOpen && (
          <div className={styles.exportMenu}>
            <a href={`/api/talks/${slug}/export/markdown`} download className={styles.exportMenuItem}>
              Markdown
            </a>
            <a href={`/api/talks/${slug}/export/pptx`} download className={styles.exportMenuItem}>
              PPTX
            </a>
            <a href={`/api/talks/${slug}/export/pdf`} download className={styles.exportMenuItem}>
              PDF
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
