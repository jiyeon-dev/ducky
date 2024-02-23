import { useQueryClient } from "@tanstack/react-query";
import { Layout } from "lucide-react";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { CardWithList } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useAction } from "@/hooks/useAction";
import { updateCard } from "@/actions/kanban/updateCard";
import { toast } from "sonner";
import { FormTextarea } from "../form/formTextarea";
import { User } from "firebase/auth";

interface HeaderProps {
  data: CardWithList;
  user?: User | null;
}

const resizeTextarea = (target: HTMLTextAreaElement) => {
  target.style.height = `auto`;
  target.style.height = `${target.scrollHeight}px`;
};

export const Header = ({ data, user }: HeaderProps) => {
  const queryClient = useQueryClient();
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [title, setTitle] = useState(data.title);

  useEffect(() => {
    resizeTextarea(textareaRef.current as HTMLTextAreaElement);
    textareaRef.current?.blur(); // submit 후 blur 처리
  }, [title]);

  const { execute } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["card"] });
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    history.pushState({}, "", location.pathname);

    const formData = new FormData(e.target as HTMLFormElement);
    const newTitle = (formData.get("title") as string).trim();
    if (!newTitle || newTitle === title) {
      return;
    }

    execute({
      title: newTitle,
      boardId: data.list.boardId,
      id: data.id,
      listId: data.listId,
    });
  };

  const onBlur = () => {
    textareaRef.current?.form?.dispatchEvent(
      new Event("submit", { cancelable: true, bubbles: true })
    );
  };

  const onTextareaInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    // textarea 높이 조절
    const self = event.target as HTMLTextAreaElement;
    resizeTextarea(self);
  };

  const onKeydown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      textareaRef.current?.blur();
    }
  };

  if (!data || Object.keys(data).length === 0) return <></>;

  return (
    <div className='flex items-start gap-x-3 mb-1 w-full sticky'>
      <Layout className='h-5 w-5 mt-3 text-[var(--kanban-text)]' />
      <div className='w-full'>
        <form onSubmit={onSubmit}>
          <FormTextarea
            id='title'
            ref={textareaRef}
            defaultValue={title}
            onInput={onTextareaInput}
            onBlur={onBlur}
            onKeyDown={onKeydown}
            disabled={!user}
            className='min-h-[10px] whitespace-pre-wrap font-semibold text-xl px-1 text-[var(--kanban-text)] disabled:opacity-1 focus:bg-[var(--kanban-bg)] bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:border-input mb-0.5 truncate'
          />
        </form>
        <p className='text-sm text-muted-foreground'>
          in list <span className='underline'>{data.list.title}</span>
        </p>
      </div>
    </div>
  );
};

Header.Skeleton = function HeaderSkeleton() {
  return (
    <div className='flex items-start gap-x-3 mb-6'>
      <Skeleton className='h-6 w-6 mt-1 bg-neutral-200 dark:bg-neutral-500' />
      <div>
        <Skeleton className='w-24 h-6 mb-1 bg-neutral-200 dark:bg-neutral-500' />
        <Skeleton className='w-12 h-4 bg-neutral-200 dark:bg-neutral-500' />
      </div>
    </div>
  );
};
