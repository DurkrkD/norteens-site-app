import { useRef, useState, useCallback } from "react";

/**
 * Native-style pull-to-refresh hook.
 * Attach `containerProps` to a scrollable (or full-page) element,
 * and call `refresh` inside your async data loader.
 */
export function usePullToRefresh(onRefresh) {
  const [pullDistance, setPullDistance] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const startY = useRef(0);
  const pulling = useRef(false);
  const THRESHOLD = 70;
  const MAX_PULL = 100;

  const onTouchStart = useCallback(
    (e) => {
      if (window.scrollY > 0 || refreshing) return;
      startY.current = e.touches[0].clientY;
      pulling.current = true;
    },
    [refreshing]
  );

  const onTouchMove = useCallback(
    (e) => {
      if (!pulling.current || refreshing) return;
      const delta = e.touches[0].clientY - startY.current;
      if (delta <= 0) {
        setPullDistance(0);
        return;
      }
      // Dampen the pull
      setPullDistance(Math.min(delta * 0.5, MAX_PULL));
    },
    [refreshing]
  );

  const onTouchEnd = useCallback(async () => {
    if (!pulling.current) return;
    pulling.current = false;
    if (pullDistance >= THRESHOLD) {
      setRefreshing(true);
      setPullDistance(THRESHOLD);
      try {
        await onRefresh();
      } finally {
        setRefreshing(false);
        setPullDistance(0);
      }
    } else {
      setPullDistance(0);
    }
  }, [pullDistance, onRefresh, refreshing]);

  const containerProps = {
    onTouchStart,
    onTouchMove,
    onTouchEnd,
  };

  const progress = Math.min(pullDistance / THRESHOLD, 1);

  return { pullDistance, refreshing, progress, containerProps };
}