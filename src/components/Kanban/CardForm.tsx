import React, {
  useRef,
  KeyboardEventHandler,
  ChangeEvent,
  useEffect,
} from "react";
import { useOnClickOutside, useEventListener } from "usehooks-ts";
import { toast } from "sonner";
import { Plus, X } from "lucide-react";
import { useAction } from "@/hooks/useAction";
import { createCard } from "@/actions/kanban/createCard";
import { Button } from "@/components/ui/button";
import { FormTextarea } from "./form/formTextarea";
import { FormSubmit } from "./form/formSubmit";
import { useLocation } from "react-router-dom";

interface CardFormProps {
  listId: string;
  boardId: string;
  isEditing: boolean;
  enableEditing: () => void;
  disableEditing: () => void;
}

export const CardForm = ({
  listId,
  boardId,
  enableEditing,
  disableEditing,
  isEditing,
}: CardFormProps) => {
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const location = useLocation();

  useEffect(() => {
    if (isEditing) textareaRef.current?.focus();
  }, [isEditing]);

  const { execute, fieldErrors } = useAction(createCard, {
    onSuccess: (data) => {
      toast.success(`Card "${data.title}" created`);
      formRef.current?.reset();
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onTextareaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const self = event.target as HTMLTextAreaElement;
    self.style.height = `auto`;
    if (self.scrollHeight > 52) self.style.height = `${self.scrollHeight}px`;
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const onTextareaKeyDown: KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
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

  if (isEditing) {
    return (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className='m1 py-0.5 px-1 space-y-2'
      >
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
  }

  return (
    <div className='pt-2 px-2'>
      <Button
        onClick={enableEditing}
        className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
        size='sm'
        variant='ghost'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add a card
      </Button>
    </div>
  );
};
