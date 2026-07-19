import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-border bg-surface shadow-panel ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
