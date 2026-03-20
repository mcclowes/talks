"use client";

import { useEffect, useState, useMemo } from "react";
import styles from "./TableOfContents.module.scss";

interface TocItem {
  index: number;
  title: string;
  section?: string;
}

interface Section {
  name: string | undefined;
  items: TocItem[];
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

  const sections = useMemo(() => {
    const result: Section[] = [];
    for (const item of items) {
      const last = result[result.length - 1];
      if (last && item.section === last.name) {
        last.items.push(item);
      } else {
        result.push({ name: item.section, items: [item] });
      }
    }
    return result;
  }, [items]);

  const activeSectionIndex = sections.findIndex((sec) =>
    sec.items.some((item) => item.index === activeIndex),
  );

  return (
    <nav className={styles.toc} aria-label="Table of contents">
      <h3 className={styles.heading}>Contents</h3>
      <ol className={styles.list}>
        {sections.map((section, si) => {
          const isActive = si === activeSectionIndex;

          return (
            <li key={si} className={styles.sectionGroup}>
              {section.name && (
                <button
                  className={`${styles.sectionHeader} ${isActive ? styles.sectionActive : ""}`}
                  onClick={() => handleClick(section.items[0].index)}
                >
                  {section.name}
                </button>
              )}
              {isActive && (
                <ol className={styles.sectionItems}>
                  {section.items.map((item) => (
                    <li key={item.index}>
                      <button
                        className={`${styles.item} ${activeIndex === item.index ? styles.active : ""}`}
                        onClick={() => handleClick(item.index)}
                      >
                        {item.title || `Slide ${item.index + 1}`}
                      </button>
                    </li>
                  ))}
                </ol>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
