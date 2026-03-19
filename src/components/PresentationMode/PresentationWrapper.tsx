"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, ReactNode } from "react";
import { PresentationMode, Slide } from "./PresentationMode";

interface PresentationWrapperProps {
  slides: Slide[];
  title: string;
  subtitle?: string;
  children: ReactNode;
}

function PresentationSwitch({
  slides,
  title,
  subtitle,
  children,
}: PresentationWrapperProps) {
  const searchParams = useSearchParams();
  const isPresenting = searchParams.get("mode") === "presentation";

  if (isPresenting) {
    return (
      <PresentationMode slides={slides} title={title} subtitle={subtitle} />
    );
  }

  return <>{children}</>;
}

export function PresentationWrapper(props: PresentationWrapperProps) {
  return (
    <Suspense fallback={props.children}>
      <PresentationSwitch {...props} />
    </Suspense>
  );
}
