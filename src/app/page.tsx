import Link from "next/link";
import { getAllTalks } from "@/lib/talks";
import styles from "./page.module.scss";

export default function Home() {
  const talks = getAllTalks();

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1 className={styles.title}>Talks</h1>
        <a href="https://mcclowes.com" className={styles.aboutLink}>
          About Max
        </a>
      </div>
      {talks.length === 0 ? (
        <p className={styles.empty}>
          No talks yet. Add markdown files to <code>data/talks/</code> to get
          started.
        </p>
      ) : (
        <ul className={styles.list}>
          {talks.map((talk) => (
            <li key={talk.slug}>
              <Link href={`/${talk.slug}`} className={styles.card}>
                <h2>{talk.title}</h2>
                {talk.subtitle && (
                  <p className={styles.subtitle}>{talk.subtitle}</p>
                )}
                {talk.date && <span className={styles.date}>{talk.date}</span>}
                {talk.tags && (
                  <div className={styles.tags}>
                    {talk.tags.map((tag) => (
                      <span key={tag} className={styles.tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
