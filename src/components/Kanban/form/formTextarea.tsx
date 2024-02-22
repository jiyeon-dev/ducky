"use client";

import { forwardRef } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { FormErrors } from "./formErrors";

interface FormTextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  id: string;
  label?: string;
  errors?: Record<string, string[] | undefined>;
}

export const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      id,
      label,
      placeholder,
      required,
      disabled = false,
      errors,
      className,
      onBlur,
      onClick,
      onKeyDown,
      onInput,
      defaultValue,
      ...props
    },
    ref
  ) => {
    return (
      <div className='space-y-2 w-full'>
        <div className='space-y-1 w-full'>
          {label ? (
            <Label
              htmlFor={id}
              className='text-xs font-semibold text-neutral-700'
            >
              {label}
            </Label>
          ) : null}
          <Textarea
            name={id}
            id={id}
            ref={ref}
            className={cn(
              "resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm",
              className
            )}
            onBlur={onBlur}
            onClick={onClick}
            onKeyDown={onKeyDown}
            onInput={onInput}
            required={required}
            placeholder={placeholder}
            disabled={disabled}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
            rows={1}
            {...props}
          ></Textarea>
          <FormErrors id={id} errors={errors} />
        </div>
      </div>
    );
  }
);

FormTextarea.displayName = "FormTextarea";
