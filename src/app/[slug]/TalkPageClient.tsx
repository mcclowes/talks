"use client";

import { useEffect, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.scss";

interface TalkPageClientProps {
  slug: string;
}

export function TalkPageClient({ slug }: TalkPageClientProps) {
  const router = useRouter();
  const pathname = usePathname();

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

  return (
    <div className={styles.actions}>
      <button className={styles.presentButton} onClick={startPresentation}>
        Present
      </button>
      <div className={styles.exportButtons}>
        <a href={`/api/talks/${slug}/export/markdown`} download className={styles.exportButton}>
          Markdown
        </a>
        <a href={`/api/talks/${slug}/export/pptx`} download className={styles.exportButton}>
          PPTX
        </a>
        <a href={`/api/talks/${slug}/export/pdf`} download className={styles.exportButton}>
          PDF
        </a>
      </div>
    </div>
  );
}
