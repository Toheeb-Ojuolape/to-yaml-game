import type { ButtonHTMLAttributes, ReactNode } from "react";
import { motion } from "framer-motion";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onDrag" | "onDragStart" | "onDragEnd" | "onAnimationStart" | "onAnimationEnd" | "onAnimationIteration"
>;

interface ButtonProps extends NativeButtonProps {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-accent text-[#1a1204] hover:bg-[#ffb43e] shadow-[0_0_0_1px_var(--color-accent-dim)] disabled:opacity-40 disabled:hover:bg-accent",
  secondary:
    "bg-surface text-text border border-border-strong hover:border-accent/50 hover:bg-surface-hover",
  ghost: "bg-transparent text-muted hover:text-text hover:bg-surface",
  danger: "bg-transparent text-error border border-error/30 hover:bg-error-soft",
};

export function Button({
  variant = "primary",
  icon,
  fullWidth,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <motion.button
      whileTap={disabled ? undefined : { scale: 0.96 }}
      whileHover={disabled ? undefined : { y: -1 }}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold tracking-tight transition-colors cursor-pointer disabled:cursor-not-allowed ${
        fullWidth ? "w-full" : ""
      } ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {icon}
      {children}
    </motion.button>
  );
}
