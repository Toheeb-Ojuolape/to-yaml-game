import type { HTMLAttributes } from "react";

export function Card({ className = "", children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`border-border bg-surface shadow-panel rounded-2xl border ${className}`} {...props}>
      {children}
    </div>
  );
}
