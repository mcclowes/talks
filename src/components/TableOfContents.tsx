"use client";

import { useEffect, useState } from "react";
import styles from "./TableOfContents.module.scss";

interface TocItem {
  index: number;
  title: string;
  section?: string;
}

export function TableOfContents({ items }: { items: TocItem[] }) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-slide-index]");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = Number(
              (entry.target as HTMLElement).dataset.slideIndex,
            );
            setActiveIndex(idx);
          }
        }
      },
      { rootMargin: "-20% 0px -60% 0px" },
    );

    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const handleClick = (index: number) => {
    const el = document.querySelector(`[data-slide-index="${index}"]`);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Group items by section
  let currentSection: string | undefined;

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <h3 className={styles.heading}>Contents</h3>
      <ol className={styles.list}>
        {items.map((item) => {
          const showSection =
            item.section && item.section !== currentSection;
          if (item.section) currentSection = item.section;

          return (
            <li key={item.index}>
              {showSection && (
                <span className={styles.section}>{item.section}</span>
              )}
              <button
                className={`${styles.item} ${activeIndex === item.index ? styles.active : ""}`}
                onClick={() => handleClick(item.index)}
              >
                {item.title || `Slide ${item.index + 1}`}
              </button>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
