/* eslint-disable @typescript-eslint/no-explicit-any */
import { RefObject, useEffect } from "react";

export default function useIntersectionObserver({
  root,
  target,
  onIntersect,
  threshold = 1.0,
  rootMargin = "0px",
  enabled = true,
}: {
  root: HTMLElement | RefObject<HTMLElement> | null;
  target: HTMLElement | RefObject<HTMLElement>;
  onIntersect: () => void;
  threshold?: number;
  rootMargin?: string;
  enabled?: boolean;
}) {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => entry.isIntersecting && onIntersect()),
      {
        root: root && (root as RefObject<HTMLElement>).current,
        rootMargin,
        threshold,
      }
    );

    // 관측 시작
    const el = target && (target as RefObject<HTMLElement>).current;
    if (!el) return;
    observer.observe(el);

    return () => {
      observer && observer.unobserve(el);
    };
  }, [target, enabled, root, threshold, rootMargin, onIntersect]);
}
