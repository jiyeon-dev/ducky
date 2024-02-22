"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface FormSubmitProps {
  children: React.ReactNode;
  disabled?: boolean;
  className?: string;
  onClick?: () => void;
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export const FormSubmit = ({
  children,
  disabled = false,
  className,
  variant = "primary",
  onClick,
}: FormSubmitProps) => {
  const textColor = variant === "primary" ? "dark:text-white" : "";
  return (
    <Button
      disabled={disabled}
      type='submit'
      variant={variant}
      size='sm'
      className={cn(textColor, className)}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};
