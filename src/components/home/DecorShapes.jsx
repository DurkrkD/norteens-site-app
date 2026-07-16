import React from "react";

export default function DecorShapes({ className = "" }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute top-10 left-8 w-3 h-3 rounded-full bg-primary/30" />
      <div className="absolute top-32 right-12 w-4 h-4 rounded-full bg-secondary/30" />
      <div className="absolute bottom-20 left-16 w-2.5 h-2.5 rounded-full bg-highlight/40" />
      <div className="absolute bottom-40 right-20 w-5 h-5 rounded-full border-2 border-primary/20" />
      <div className="absolute top-1/2 left-4 w-2 h-2 rounded-full bg-highlight/50" />
      <div className="absolute top-20 right-1/3 w-3 h-3 rounded-full bg-secondary/20" />
    </div>
  );
}