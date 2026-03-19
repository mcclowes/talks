"use client";

import { useRouter, usePathname } from "next/navigation";
import styles from "./page.module.scss";

export function TalkPageClient() {
  const router = useRouter();
  const pathname = usePathname();

  function startPresentation() {
    router.push(`${pathname}?mode=presentation`);
  }

  return (
    <div className={styles.actions}>
      <button className={styles.presentButton} onClick={startPresentation}>
        Present
      </button>
    </div>
  );
}
