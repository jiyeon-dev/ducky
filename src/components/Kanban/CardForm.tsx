import React, { useRef, ChangeEvent, useEffect } from "react";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { toast } from "sonner";
import { useAction } from "@/hooks/useAction";
import { createCard } from "@/actions/kanban/createCard";
import { FormTextarea } from "./form/formTextarea";
import { useLocation } from "react-router-dom";
import { FormSubmit } from "./form/formSubmit";
import { Button } from "../ui/button";
import { X } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CardFormProps {
  listId: string;
  boardId: string;
  isEditing: boolean;
  disableEditing: () => void;
  onListScrollToBottom: () => void;
}

export const CardForm = ({
  listId,
  boardId,
  disableEditing,
  isEditing,
  onListScrollToBottom,
}: CardFormProps) => {
  const queryClient = useQueryClient();
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (isEditing) {
      textareaRef.current?.focus();
    }
  }, [isEditing]);

  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data?.title}" created`);
      queryClient.invalidateQueries({ queryKey: ["storage"] });
      formRef.current?.reset();
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onTextareaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // textarea 높이 조절
    const self = event.target as HTMLTextAreaElement;
    self.style.height = `auto`;
    if (self.scrollHeight > 52) self.style.height = `${self.scrollHeight}px`;

    // 리스트 스크롤 맨 밑으로 이동
    onListScrollToBottom();
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onTextareaKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      formRef.current?.dispatchEvent(
        new Event("submit", { cancelable: true, bubbles: true })
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.pushState({}, "", location.pathname);

    const formData = new FormData(e.target as HTMLFormElement);
    const title = (formData.get("title") as string).trim();
    if (!title) {
      disableEditing();
      return;
    }
    execute({ title, listId, boardId });
  };

  useOnClickOutside(formRef, disableEditing);
  useEventListener("keydown", onKeyDown);

  return (
    <form ref={formRef} onSubmit={handleSubmit} className='py-0.5 space-y-2'>
      <FormTextarea
        id='title'
        onKeyDown={onTextareaKeyDown}
        onInput={onTextareaInput}
        ref={textareaRef}
        placeholder='Enter a title for this card...'
        className='resize-none overflow-y-hidden h-auto min-h-5 pb-6'
        errors={fieldErrors}
      />
      <div className='flex items-center gap-x-1'>
        <FormSubmit className='h-8'>Add card</FormSubmit>
        <Button
          onClick={disableEditing}
          size='sm'
          variant='ghost'
          className='h-8'
        >
          <X className='h-5 w-5' />
        </Button>
      </div>
    </form>
  );
};
