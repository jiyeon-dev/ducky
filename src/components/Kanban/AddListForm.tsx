import { ElementRef, useRef, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FormInput } from "./form/formInput";
import { FormSubmit } from "./form/formSubmit";
import { useEventListener, useOnClickOutside } from "usehooks-ts";
import { useAction } from "@/hooks/useAction";
import { createList } from "@/actions/kanban/createList";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const BOARD_ID = import.meta.env.VITE_KANBAN_BOARD_ID;

export const AddListForm = () => {
  const queryClient = useQueryClient();
  const { boardId = BOARD_ID } = useParams();
  const formRef = useRef<ElementRef<"form">>(null);
  const inputRef = useRef<ElementRef<"input">>(null);
  const [isEditing, setIsEditing] = useState(false);

  const location = useLocation();

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing();
    }
  };

  const { execute, fieldErrors } = useAction(createList, {
    onSuccess: (data) => {
      toast.success(`List "${data.title}" created`);
      queryClient.invalidateQueries({ queryKey: ["storage"] });
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.pushState({}, "", location.pathname);

    const titleEl = inputRef.current as HTMLInputElement;
    const newTitle = titleEl.value.trim();
    if (!newTitle) return;

    execute({ title: newTitle, boardId });
  };

  useEventListener("keydown", onKeyDown);
  useOnClickOutside(formRef, disableEditing);

  let content;
  if (isEditing) {
    content = (
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className='w-full p-3 space-y-2 shadow-md'
      >
        <FormInput
          ref={inputRef}
          id='title'
          className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input bg-[var(--kanban-list-bg)] transition'
          placeholder='Enter list title...'
          errors={fieldErrors}
        />
        <div className='flex items-center gap-x-1'>
          <FormSubmit className='h-8'>Add list</FormSubmit>
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
  } else {
    content = (
      <button
        onClick={enableEditing}
        className='w-full dark:bg-transparent transition p-3 flex items-center font-medium text-sm'
      >
        <Plus className='h-4 w-4 mr-2' />
        Add another list
      </button>
    );
  }

  return (
    <li
      className={cn(
        "shrink-0 h-fit w-[272px] select-none rounded-md",
        isEditing ? "bg-[var(--kanban-list-bg)]" : ""
      )}
    >
      {content}
    </li>
  );
};
