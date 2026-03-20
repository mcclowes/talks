"use client";

import { useState, type ReactNode } from "react";
import styles from "./page.module.scss";

interface TalkTabsProps {
  summary: ReactNode;
  slides: ReactNode;
}

export function TalkTabs({ summary, slides }: TalkTabsProps) {
  const [activeTab, setActiveTab] = useState<"summary" | "slides">("summary");

  return (
    <>
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "summary" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("summary")}
        >
          Summary
        </button>
        <button
          className={`${styles.tab} ${activeTab === "slides" ? styles.tabActive : ""}`}
          onClick={() => setActiveTab("slides")}
        >
          Slides
        </button>
      </div>
      {activeTab === "summary" ? summary : slides}
    </>
  );
}
