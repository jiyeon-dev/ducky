import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { XCircle } from "lucide-react";
import React, { ChangeEvent, useCallback, useEffect, useRef } from "react";

interface FormTextareaProps {
  id: string;
  defaultValue?: string;
  rows?: number;
  maxLength?: number;
  preventEnter?: boolean;
  onInput?: (event: ChangeEvent<HTMLTextAreaElement>) => void;
  onKeydown?: (event: React.KeyboardEvent) => void;
  errors?: Record<string, string[] | undefined>;
}

export default function FormTextarea({
  id,
  defaultValue = "",
  rows = 1,
  maxLength = 100,
  preventEnter = true,
  onInput,
  onKeydown,
  errors,
}: FormTextareaProps) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const error = errors?.[id]?.[0] || ""; // 첫번쨰 오류 하나만 노출

  const resizeTextarea = useCallback(
    (target: HTMLTextAreaElement | null, rendered = false) => {
      if (!target) return;
      target.style.height = `auto`;
      if (rendered) {
        // render 후 defaultValue값이 존재하면 timeout으로 높이 조절
        setTimeout(
          () => (target.style.height = `${target.scrollHeight}px`),
          100
        );
      } else {
        target.style.height = `${target.scrollHeight}px`;
      }
    },
    []
  );

  const onTextareaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const self = event.target as HTMLTextAreaElement;
    resizeTextarea(self);
  };

  // EnterKey 방지
  const onPreventEnterKeydown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      return;
    }
  };

  useEffect(() => {
    if (textareaRef.current) {
      resizeTextarea(textareaRef.current, true);
    }
  }, []);

  window.addEventListener("resize", () => resizeTextarea(textareaRef.current));

  return (
    <div className='flex items-start space-x-4'>
      <Label htmlFor='title' className='mt-3 min-w-20 text-center capitalize'>
        {id}
      </Label>
      <div className='flex flex-col items-start flex-grow'>
        <Textarea
          ref={textareaRef}
          id={id}
          name={id}
          defaultValue={defaultValue}
          placeholder={id}
          className={cn(
            "min-h-[38px] overflow-y-hidden resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none",
            error ? "border-red-500" : ""
          )}
          rows={rows}
          maxLength={maxLength}
          onInput={onInput || onTextareaInput}
          onKeyDown={(event) => {
            if (preventEnter) onPreventEnterKeydown(event);
            if (onKeydown) onKeydown(event);
          }}
          style={{ boxSizing: "border-box" }}
        />
        {error && (
          <div className='flex text-xs p-2 text-rose-500'>
            <XCircle className='h-4 w-4 mr-2' />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
