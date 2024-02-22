import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link"
    | "primary";
}

export const ActionButton = ({
  onClick,
  disabled,
  children,
  className,
  variant,
}: ButtonProps) => {
  const styles =
    "bg-[var(--kanban-modal-btn)] hover:bg-[var(--kanban-modal-btn-hover)] text-[var(--kanban-text)]";
  return (
    <Button
      onClick={onClick}
      disabled={disabled}
      variant={variant}
      className={cn("w-full justify-start ", variant ? "" : styles, className)}
      size='inline'
    >
      {children}
    </Button>
  );
};
