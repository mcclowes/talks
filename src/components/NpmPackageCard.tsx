"use client";

import { useEffect, useState } from "react";
import styles from "./NpmPackageCard.module.scss";

interface NpmData {
  description?: string;
  keywords?: string[];
  license?: string | string[];
  "dist-tags"?: Record<string, string>;
  versions?: Record<string, { keywords?: string[]; license?: string | string[] }>;
  time?: Record<string, string>;
}

export function NpmPackageCard({ packageName }: { packageName: string }) {
  const [data, setData] = useState<NpmData | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function fetchPackage() {
      try {
        const resp = await fetch(
          `https://registry.npmjs.org/${packageName}`,
        );
        if (!resp.ok) throw new Error(`${resp.status}`);
        const json = await resp.json();
        if (mounted) setData(json);
      } catch {
        if (mounted) setError(true);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchPackage();
    return () => {
      mounted = false;
    };
  }, [packageName]);

  const latestVersion = data?.["dist-tags"]?.latest;
  const latestVersionData =
    latestVersion && data?.versions?.[latestVersion];
  const keywords =
    (latestVersionData && latestVersionData.keywords) ||
    data?.keywords ||
    [];
  const license =
    (latestVersionData && latestVersionData.license) || data?.license;
  const publishedDate =
    latestVersion && data?.time?.[latestVersion]
      ? new Date(data.time[latestVersion])
      : null;

  return (
    <a
      className={styles.card}
      href={`https://www.npmjs.com/package/${packageName}`}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.header}>
        <div className={styles.packageName}>
          <span className={styles.npmIcon} aria-hidden>
            📦
          </span>
          {packageName}
        </div>
        {loading ? (
          <span className={styles.badge}>Loading…</span>
        ) : error ? (
          <span className={styles.badgeError}>Error</span>
        ) : latestVersion ? (
          <span className={styles.badge}>v{latestVersion}</span>
        ) : null}
      </div>

      <p className={styles.description}>
        {loading
          ? "Fetching package details…"
          : data?.description || "No description provided."}
      </p>

      <div className={styles.metaRow}>
        {license && (
          <span className={styles.metaItem} title="License">
            📄 {Array.isArray(license) ? license.join(", ") : license}
          </span>
        )}
        {publishedDate && (
          <span className={styles.metaItem} title="Last updated">
            ⏱️ {publishedDate.toLocaleDateString()}
          </span>
        )}
        {data?.time?.created && (
          <span className={styles.metaItem} title="Created">
            🆕 {new Date(data.time.created).toLocaleDateString()}
          </span>
        )}
      </div>

      {keywords.length > 0 && (
        <div className={styles.topics}>
          {keywords.slice(0, 6).map((k) => (
            <span key={k} className={styles.topic}>
              {k}
            </span>
          ))}
        </div>
      )}

      <svg
        className={styles.npmLogo}
        viewBox="0 0 27.23 27.23"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <rect width="27.23" height="27.23" rx="2" fill="#CB3837" />
        <polygon
          fill="#fff"
          points="5.8 21.75 13.66 21.75 13.67 9.98 17.59 9.98 17.58 21.76 21.51 21.76 21.52 6.06 5.82 6.04 5.8 21.75"
        />
      </svg>
    </a>
  );
}
