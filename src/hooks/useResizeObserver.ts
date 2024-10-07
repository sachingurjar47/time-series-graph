import { useEffect, useState } from "react";

const useResizeObserver = <T extends HTMLElement>(ref: React.RefObject<T>) => {
  const [dimensions, setDimensions] = useState<DOMRect | null>(null);

  useEffect(() => {
    const observeTarget = ref.current;

    if (!observeTarget) return;

    const resizeObserver = new ResizeObserver((entries) => {
      entries.forEach((entry) => {
        setDimensions(entry.contentRect);
      });
    });

    resizeObserver.observe(observeTarget);

    return () => {
      resizeObserver.unobserve(observeTarget);
    };
  }, [ref]);

  return dimensions;
};

export default useResizeObserver;
