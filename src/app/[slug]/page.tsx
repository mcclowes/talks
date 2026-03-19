import { notFound } from "next/navigation";
import { getTalk, getTalkSlugs } from "@/lib/talks";
import { SlideContent } from "@/components/SlideContent";
import { PresentationWrapper } from "@/components/PresentationMode";
import type { Slide } from "@/components/PresentationMode";
import { TalkPageClient } from "./TalkPageClient";
import styles from "./page.module.scss";

export function generateStaticParams() {
  return getTalkSlugs().map((slug) => ({ slug }));
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

  return (
    <PresentationWrapper
      slides={slides}
      title={talk.title}
      subtitle={talk.subtitle}
    >
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>{talk.title}</h1>
          {talk.subtitle && <p className={styles.subtitle}>{talk.subtitle}</p>}
          {talk.date && <span className={styles.date}>{talk.date}</span>}
        </header>

        <TalkPageClient slug={slug} />

        <div className={styles.slides}>
          {talk.slides.map((slide, i) => (
            <section key={i} className={styles.slideSection}>
              {slide.title && <h2>{slide.title}</h2>}
              <SlideContent markdown={slide.body} />
            </section>
          ))}
        </div>
      </main>
    </PresentationWrapper>
  );
}
