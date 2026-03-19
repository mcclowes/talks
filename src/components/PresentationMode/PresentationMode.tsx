"use client";

import { useState, useEffect, useCallback, useRef, ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import styles from "./PresentationMode.module.scss";

export interface Slide {
  title: string;
  content: ReactNode;
  section?: string;
}

interface PresentationModeProps {
  slides: Slide[];
  title: string;
  subtitle?: string;
}

const SWIPE_THRESHOLD = 50;

export function PresentationMode({
  slides,
  title,
  subtitle,
}: PresentationModeProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialSlide = Math.min(
    Math.max(0, Number(searchParams.get("slide") || 1) - 1),
    slides.length - 1,
  );
  const [current, setCurrent] = useState(initialSlide);
  const isMobile = typeof window !== "undefined" && window.innerWidth <= 640;
  const [fontScale, setFontScale] = useState(isMobile ? 1 : 1.2);
  const [showTOC, setShowTOC] = useState(false);
  const total = slides.length;
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const increaseFontSize = useCallback(() => {
    setFontScale((s) => Math.min(s + 0.1, 2));
  }, []);

  const decreaseFontSize = useCallback(() => {
    setFontScale((s) => Math.max(s - 0.1, 0.5));
  }, []);

  useEffect(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("slide", String(current + 1));
    window.history.replaceState(null, "", url.pathname + url.search);
  }, [current]);

  const exit = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("mode");
    url.searchParams.delete("slide");
    router.push(url.pathname + url.search);
  }, [router]);

  const goNext = useCallback(() => {
    setCurrent((c) => Math.min(c + 1, total - 1));
  }, [total]);

  const goPrev = useCallback(() => {
    setCurrent((c) => Math.max(c - 1, 0));
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.metaKey && (e.key === "=" || e.key === "+")) {
        e.preventDefault();
        increaseFontSize();
      } else if (e.metaKey && e.key === "-") {
        e.preventDefault();
        decreaseFontSize();
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setShowTOC(true);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setShowTOC(false);
      } else if (showTOC) {
        if (e.key === "Escape") {
          e.preventDefault();
          setShowTOC(false);
        }
        return;
      } else if (e.key === "ArrowRight" || e.key === " ") {
        e.preventDefault();
        goNext();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goPrev();
      } else if (e.key === "Escape") {
        exit();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev, exit, increaseFontSize, decreaseFontSize, showTOC]);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (touchStartX.current === null || touchStartY.current === null) return;
      const dx = e.changedTouches[0].clientX - touchStartX.current;
      const dy = e.changedTouches[0].clientY - touchStartY.current;
      touchStartX.current = null;
      touchStartY.current = null;

      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dy) > Math.abs(dx)) return;

      if (dx < 0) goNext();
      else goPrev();
    },
    [goNext, goPrev],
  );

  const slide = slides[current];
  const isSectionSlide = slide.section === slide.title && slide.section !== undefined;
  const isTitleSlide = current === 0;

  // Group slides into sections for the progress indicator
  const sections = slides.reduce<
    { name: string | undefined; startIndex: number; endIndex: number }[]
  >((acc, s, i) => {
    const last = acc[acc.length - 1];
    if (last && s.section === last.name) {
      last.endIndex = i;
    } else {
      acc.push({ name: s.section, startIndex: i, endIndex: i });
    }
    return acc;
  }, []);

  const currentSectionIndex = sections.findIndex(
    (sec) => current >= sec.startIndex && current <= sec.endIndex,
  );

  return (
    <div
      className={styles.presentation}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className={styles.topBar}>
        <div className={styles.fontControls}>
          <button
            className={styles.fontButton}
            onClick={decreaseFontSize}
            aria-label="Decrease font size"
          >
            A-
          </button>
          <button
            className={styles.fontButton}
            onClick={increaseFontSize}
            aria-label="Increase font size"
          >
            A+
          </button>
        </div>
        <button
          className={styles.exit}
          onClick={exit}
          aria-label="Exit presentation"
        >
          Exit
        </button>
      </div>
      <div
        className={`${styles.slide} ${isTitleSlide ? styles.titleSlide : ""} ${isSectionSlide ? styles.sectionSlide : ""}`}
        style={{ fontSize: `${fontScale}em` }}
      >
        <div className={styles.slideHeader}>
          {!isSectionSlide && (
            <span className={styles.supertitle}>{slide.section || title}</span>
          )}
          <h1 className={styles.slideTitle}>{slide.title}</h1>
          {current === 0 && subtitle && (
            <p className={styles.subtitle}>{subtitle}</p>
          )}
        </div>
        {!isSectionSlide && (
          <div className={styles.slideContent}>{slide.content}</div>
        )}
      </div>

      {showTOC && (
        <div className={styles.tocOverlay} onClick={() => setShowTOC(false)}>
          <div
            className={styles.tocPanel}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className={styles.tocTitle}>Table of contents</h2>
            <nav className={styles.tocNav}>
              {slides.map((s, i) => {
                const prevSection = i > 0 ? slides[i - 1].section : undefined;
                const isNewSection = s.section && s.section !== prevSection;
                return (
                  <div key={i}>
                    {isNewSection && (
                      <div className={styles.tocSection}>{s.section}</div>
                    )}
                    <button
                      className={styles.tocItem}
                      data-active={i === current}
                      onClick={() => {
                        setCurrent(i);
                        setShowTOC(false);
                      }}
                    >
                      <span className={styles.tocSlideNum}>{i + 1}</span>
                      <span>{s.title || "(untitled)"}</span>
                    </button>
                  </div>
                );
              })}
            </nav>
          </div>
        </div>
      )}

      <div className={styles.controls}>
        <button
          className={styles.navButton}
          onClick={goPrev}
          disabled={current === 0}
          aria-label="Previous slide"
        >
          ‹
        </button>
        <div className={styles.progress}>
          {sections.map((sec, si) => {
            const isCurrentSection = si === currentSectionIndex;
            if (isCurrentSection) {
              return Array.from(
                { length: sec.endIndex - sec.startIndex + 1 },
                (_, j) => {
                  const slideIndex = sec.startIndex + j;
                  return (
                    <button
                      key={slideIndex}
                      className={styles.dot}
                      data-active={slideIndex === current}
                      onClick={() => setCurrent(slideIndex)}
                      title={slides[slideIndex].title || `Slide ${slideIndex + 1}`}
                      aria-label={`Go to slide ${slideIndex + 1}`}
                    />
                  );
                },
              );
            }
            return (
              <button
                key={`section-${si}`}
                className={`${styles.dot} ${styles.sectionDot}`}
                onClick={() => setCurrent(sec.startIndex)}
                title={sec.name || "Intro"}
                aria-label={`Go to section: ${sec.name || "Intro"}`}
              />
            );
          })}
        </div>
        <button
          className={styles.navButton}
          onClick={goNext}
          disabled={current === total - 1}
          aria-label="Next slide"
        >
          ›
        </button>
        <span className={styles.counter}>
          {current + 1} / {total}
        </span>
      </div>
    </div>
  );
}
