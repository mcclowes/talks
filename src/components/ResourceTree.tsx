"use client";

import { useState } from "react";
import type { ResourceFile, ResourceLink } from "@/lib/talks";
import styles from "./ResourceTree.module.scss";

interface ResourceTreeProps {
  slug: string;
  links?: ResourceLink[];
  files?: ResourceFile[];
}

function ResourceNode({
  node,
  slug,
}: {
  node: ResourceFile;
  slug: string;
}) {
  const [expanded, setExpanded] = useState(true);

  if (node.type === "directory") {
    return (
      <li className={styles.directory}>
        <button
          className={styles.dirToggle}
          onClick={() => setExpanded(!expanded)}
        >
          <span className={styles.icon}>{expanded ? "▾" : "▸"}</span>
          {node.name}/
        </button>
        {expanded && node.children && (
          <ul className={styles.list}>
            {node.children.map((child) => (
              <ResourceNode key={child.path} node={child} slug={slug} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  return (
    <li className={styles.file}>
      <a
        href={`/api/talks/${slug}/resources/${node.path}`}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.fileLink}
      >
        {node.name}
      </a>
    </li>
  );
}

export function ResourceTree({ slug, links, files }: ResourceTreeProps) {
  const [filesExpanded, setFilesExpanded] = useState(false);

  return (
    <div className={styles.resources}>
      {links && links.length > 0 && (
        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>Links</h3>
          <ul className={styles.linkList}>
            {links.map((link) => (
              <li key={link.url} className={styles.linkItem}>
                <a
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.linkAnchor}
                >
                  {link.title}
                  <span className={styles.externalIcon}>&#8599;</span>
                </a>
                {link.description && (
                  <p className={styles.linkDescription}>{link.description}</p>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {files && files.length > 0 && (
        <section className={styles.section}>
          <button
            className={styles.filesToggle}
            onClick={() => setFilesExpanded(!filesExpanded)}
          >
            <h3 className={styles.sectionTitle}>
              Example files
              <span className={styles.icon}>{filesExpanded ? "▾" : "▸"}</span>
            </h3>
          </button>
          {filesExpanded && (
            <ul className={styles.list}>
              {files.map((node) => (
                <ResourceNode key={node.path} node={node} slug={slug} />
              ))}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
