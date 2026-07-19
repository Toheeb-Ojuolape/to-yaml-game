import type { ButtonHTMLAttributes, ReactNode } from "react";

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  active?: boolean;
  children: ReactNode;
}

export function IconButton({ label, active, className = "", children, ...props }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={`inline-flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
        active
          ? "border-accent/50 bg-accent-soft text-accent"
          : "border-border text-muted hover:border-border-strong hover:text-text hover:bg-surface-hover"
      } ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
