import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTalk, getTalkSlugs, getTalkResources } from "@/lib/talks";
import { SlideContent } from "@/components/SlideContent";
import { TableOfContents } from "@/components/TableOfContents";
import { ResourceTree } from "@/components/ResourceTree";
import { PresentationWrapper } from "@/components/PresentationMode";
import type { Slide } from "@/components/PresentationMode";
import { TalkPageClient } from "./TalkPageClient";
import { TalkTabs } from "./TalkTabs";
import styles from "./page.module.scss";

export function generateStaticParams() {
  return getTalkSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const talk = getTalk(slug);
  if (!talk) return {};

  const title = talk.title;
  const description = talk.subtitle || `A talk by Max Clayton Clowes`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "article",
      ...(talk.date && { publishedTime: talk.date }),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function TalkPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const talk = getTalk(slug);

  if (!talk) notFound();

  const slides: Slide[] = talk.slides.map((s) => ({
    title: s.title,
    content: <SlideContent markdown={s.body} presentation />,
    section: s.section,
  }));

  const resourceFiles = getTalkResources(slug);
  const hasLinks = (talk.resources?.length ?? 0) > 0;
  const hasFiles = resourceFiles.length > 0;
  const hasResources = hasLinks || hasFiles;
  const hasTabs = talk.summary || hasResources;

  const slidesContent = (
    <div className={styles.slides}>
      {talk.slides.map((slide, i) => (
        <section
          key={i}
          className={styles.slideSection}
          data-slide-index={i}
        >
          {slide.title && <h2>{slide.title}</h2>}
          <SlideContent markdown={slide.body} />
        </section>
      ))}
    </div>
  );

  return (
    <PresentationWrapper
      slides={slides}
      title={talk.title}
      subtitle={talk.subtitle}
    >
      <div className={styles.layout}>
        <main className={styles.main}>
          <header className={styles.header}>
            <Link href="/" className={styles.backLink}>
              &larr; All talks
            </Link>
            <h1>{talk.title}</h1>
            {talk.subtitle && (
              <p className={styles.subtitle}>{talk.subtitle}</p>
            )}
            {talk.date && <span className={styles.date}>{talk.date}</span>}
          </header>

          <TalkPageClient slug={slug} />

          {hasTabs ? (
            <TalkTabs
              summary={
                talk.summary ? (
                  <div className={styles.summary}>
                    <SlideContent markdown={talk.summary} />
                  </div>
                ) : undefined
              }
              slides={slidesContent}
              resources={
                hasResources ? (
                  <ResourceTree
                    slug={slug}
                    links={talk.resources}
                    files={hasFiles ? resourceFiles : undefined}
                  />
                ) : undefined
              }
            />
          ) : (
            slidesContent
          )}
        </main>
        <aside className={styles.sidebar}>
          <TableOfContents
            items={talk.slides.map((s, i) => ({
              index: i,
              title: s.title,
              section: s.section,
            }))}
          />
        </aside>
      </div>
    </PresentationWrapper>
  );
}
