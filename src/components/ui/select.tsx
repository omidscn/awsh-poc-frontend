"use client";

import { forwardRef, useEffect, useState, type SelectHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type SelectOption = {
  value: string;
  label: string;
};

type SelectProps = Omit<SelectHTMLAttributes<HTMLSelectElement>, "children"> & {
  label?: string;
  options: SelectOption[];
  placeholder?: string;
};

function useIsSafari() {
  const [isSafari, setIsSafari] = useState(false);
  useEffect(() => {
    const ua = navigator.userAgent;
    setIsSafari(/Safari/.test(ua) && !/Chrome/.test(ua));
  }, []);
  return isSafari;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, className, id, ...props }, ref) => {
    const isSafari = useIsSafari();

    const select = (
      <select
        ref={ref}
        id={id}
        className={cn(
          "block w-full rounded-lg border border-edge bg-white text-sm text-heading shadow-sm transition-all duration-150 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer",
          isSafari
            ? "px-3 py-2"                          // Safari: native arrow, normal padding
            : "appearance-none py-2 pl-3 pr-9",    // Others: hide native arrow, room for custom chevron
          className
        )}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );

    return (
      <div>
        {label && (
          <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-heading">
            {label}
          </label>
        )}
        {isSafari ? (
          // Safari: no wrapper, no custom arrow — use native picker as-is
          select
        ) : (
          // Chrome/Firefox: custom chevron overlay
          <div className="relative">
            {select}
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg className="h-4 w-4 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        )}
      </div>
    );
  }
);

Select.displayName = "Select";
