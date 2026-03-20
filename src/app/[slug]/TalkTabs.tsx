"use client";

import { useState, useEffect, useCallback, type ReactNode } from "react";
import styles from "./page.module.scss";

type TabId = "summary" | "slides" | "resources";

interface TalkTabsProps {
  summary?: ReactNode;
  slides: ReactNode;
  resources?: ReactNode;
}

export function TalkTabs({ summary, slides, resources }: TalkTabsProps) {
  const tabs: { id: TabId; label: string; content: ReactNode }[] = [];

  if (summary) tabs.push({ id: "summary", label: "Summary", content: summary });
  tabs.push({ id: "slides", label: "Slides", content: slides });
  if (resources) tabs.push({ id: "resources", label: "Resources", content: resources });

  const [activeTab, setActiveTab] = useState<TabId>(tabs[0].id);

  const switchToSlides = useCallback(() => setActiveTab("slides"), []);

  useEffect(() => {
    window.addEventListener("switch-to-slides-tab", switchToSlides);
    return () => window.removeEventListener("switch-to-slides-tab", switchToSlides);
  }, [switchToSlides]);

  return (
    <>
      <div className={styles.tabs}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ""}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab) => (
        <div
          key={tab.id}
          style={activeTab !== tab.id ? { display: "none" } : undefined}
        >
          {tab.content}
        </div>
      ))}
    </>
  );
}
