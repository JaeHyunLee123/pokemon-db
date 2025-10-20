import { useCallback, useEffect, useRef } from "react";

export default function useObserver(
  onIntersection: () => void,
  observerOptions?: IntersectionObserverInit
) {
  const observerRef = useRef<HTMLDivElement | null>(null);

  const handleIntersection: IntersectionObserverCallback = useCallback(
    (entries) => {
      if (entries[0].isIntersecting) {
        onIntersection();
      }
    },
    [onIntersection]
  );

  useEffect(() => {
    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => observer.disconnect();
  }, [handleIntersection, observerOptions]);

  return observerRef;
}
