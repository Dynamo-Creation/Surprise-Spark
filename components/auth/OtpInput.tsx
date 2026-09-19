"use client";

import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

export interface OtpInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (value: string) => void;
  disabled?: boolean;
  hasError?: boolean;
  className?: string;
}

export function OtpInput({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
  hasError = false,
  className,
}: OtpInputProps) {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into characters
  const digits = value.split("").slice(0, length);
  while (digits.length < length) {
    digits.push("");
  }

  // Auto-focus the first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIdx = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex;
    inputsRef.current[targetIdx]?.focus();
  }, []);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digit = rawVal.replace(/\D/g, "").slice(-1);

    const newDigits = [...digits];
    newDigits[index] = digit;
    const combined = newDigits.join("");
    onChange(combined);

    if (digit && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }

    if (combined.length === length && !combined.includes(" ")) {
      onComplete?.(combined);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        inputsRef.current[index - 1]?.focus();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        onChange(newDigits.join(""));
      } else {
        const newDigits = [...digits];
        newDigits[index] = "";
        onChange(newDigits.join(""));
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputsRef.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, length);
    if (!pasted) return;

    onChange(pasted);
    const nextIdx = Math.min(pasted.length, length - 1);
    inputsRef.current[nextIdx]?.focus();

    if (pasted.length === length) {
      onComplete?.(pasted);
    }
  };

  return (
    <div className={cn("flex items-center justify-center gap-2 sm:gap-3", className)}>
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          autoComplete="one-time-code"
          disabled={disabled}
          value={digits[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => e.target.select()}
          className={cn(
            "w-11 h-13 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border bg-white/80 dark:bg-slate-900/80 backdrop-blur-md text-slate-900 dark:text-white transition-all duration-200 outline-none shadow-xs",
            hasError
              ? "border-red-400 dark:border-red-800 text-red-600 focus:ring-2 focus:ring-red-500/20"
              : digits[i]
              ? "border-pink-500/80 ring-2 ring-pink-500/10 dark:border-pink-500/80"
              : "border-slate-200 dark:border-slate-800 focus:border-pink-500 focus:ring-2 focus:ring-pink-500/20",
            disabled && "opacity-50 cursor-not-allowed"
          )}
        />
      ))}
    </div>
  );
}
