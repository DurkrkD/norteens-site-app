import React from "react";
import { Loader2, ArrowDown } from "lucide-react";

export default function PullToRefreshIndicator({ pullDistance, refreshing, progress }) {
  if (pullDistance === 0 && !refreshing) return null;

  return (
    <div
      className="flex items-center justify-center overflow-hidden transition-none"
      style={{ height: refreshing ? 40 : pullDistance }}
    >
      {refreshing ? (
        <Loader2 className="w-5 h-5 text-primary animate-spin" />
      ) : (
        <ArrowDown
          className="w-5 h-5 text-primary transition-transform"
          style={{ transform: `rotate(${progress * 180}deg)` }}
        />
      )}
    </div>
  );
}