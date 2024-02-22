"use client";

import { forwardRef } from "react";

import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

import { FormErrors } from "./formErrors";

interface FormInputProps {
  id: string;
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  errors?: Record<string, string[] | undefined>;
  className?: string;
  defaultValue?: string;
  onBlur?: () => void;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      id,
      label,
      type,
      placeholder,
      required,
      disabled = false,
      errors,
      className,
      defaultValue = "",
      onBlur,
    },
    ref
  ) => {
    return (
      <div className='space-y-2'>
        <div className='space-y-1'>
          {label ? (
            <Label
              htmlFor={id}
              className='text-xs font-semibold text-neutral-700'
            >
              {label}
            </Label>
          ) : null}
          <Input
            onBlur={onBlur}
            defaultValue={defaultValue}
            ref={ref}
            required={required}
            name={id}
            id={id}
            placeholder={placeholder}
            disabled={disabled}
            type={type}
            className={cn(
              "text-sm px-2 py-1 h-7 bg-[var(--kanban-bg)]",
              className
            )}
            aria-describedby={`${id}-error`}
          />
        </div>
        <FormErrors id={id} errors={errors} />
      </div>
    );
  }
);

FormInput.displayName = "FormInput";
