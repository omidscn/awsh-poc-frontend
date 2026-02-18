import { forwardRef, type SelectHTMLAttributes } from "react";
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

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, placeholder, className, id, ...props }, ref) => {
    return (
      <div>
        {label && (
          <label htmlFor={id} className="mb-1 block text-sm font-medium text-subtle">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={id}
          className={cn(
            "block w-full rounded-md border border-edge bg-secondary px-3 py-2 text-sm text-primary shadow-sm transition-all duration-200 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500/50",
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
      </div>
    );
  }
);

Select.displayName = "Select";
