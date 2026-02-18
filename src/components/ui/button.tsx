import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-gradient-to-r from-brand-500 to-brand-600 text-white shadow-lg shadow-brand-500/20 hover:from-brand-400 hover:to-brand-500 hover:shadow-brand-500/30 focus-visible:ring-brand-500",
  secondary: "bg-secondary text-primary border border-edge hover:bg-hover hover:text-heading focus-visible:ring-subtle",
  danger: "bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-500/20 focus-visible:ring-red-500",
  ghost: "text-subtle hover:bg-hover hover:text-primary",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2 text-sm",
  lg: "px-6 py-3 text-base",
};

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", loading, className, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center gap-2 rounded-md font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]",
          variantClasses[variant],
          sizeClasses[size],
          className
        )}
        disabled={disabled || loading}
        {...props}
      >
        {loading && <Spinner className="h-4 w-4" />}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
