import React, { ButtonHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg" | "icon";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "relative inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500 focus-visible:ring-offset-2 active:scale-98 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none shadow-sm whitespace-nowrap";

    const variantStyles = {
      primary:
        "bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600 text-white hover:shadow-lg hover:shadow-pink-500/25 hover:brightness-105 border border-pink-400/20",
      secondary:
        "bg-slate-900 text-white hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800/80 shadow-sm",
      accent:
        "bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 text-white hover:shadow-lg hover:shadow-amber-500/25 hover:brightness-105",
      outline:
        "border border-slate-200 dark:border-slate-800 bg-white/70 dark:bg-slate-900/60 backdrop-blur-sm text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/80 hover:border-slate-300 dark:hover:border-slate-700",
      ghost:
        "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60 border-transparent shadow-none",
      destructive:
        "bg-red-500 text-white hover:bg-red-600 focus-visible:ring-red-500 hover:shadow-red-500/20",
    };

    const sizeStyles = {
      sm: "text-xs px-3.5 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-5 py-2.5 gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3 gap-2.5 min-h-[48px] font-semibold",
      icon: "p-2 min-h-[38px] min-w-[38px] rounded-full",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current shrink-0" />
        ) : (
          <>
            {leftIcon && <span className="inline-flex items-center justify-center shrink-0">{leftIcon}</span>}
            <span className="inline-flex items-center justify-center gap-1.5 leading-none">{children}</span>
            {rightIcon && <span className="inline-flex items-center justify-center shrink-0">{rightIcon}</span>}
          </>
        )}
      </button>
    );
  }
);

Button.displayName = "Button";
