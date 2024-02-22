import { Button } from "@/components/ui/button";
import { CardWithList } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { AlignLeft } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

import { cn } from "@/lib/utils";
import { Quill } from "@/components/Kanban/form/quill";
import { FormSubmit } from "../form/formSubmit";
import ReactQuill from "react-quill";
import { useAction } from "@/hooks/useAction";
import { updateCard } from "@/actions/kanban/updateCard";
import { toast } from "sonner";

interface DescriptionProps {
  data: CardWithList;
}

export const Description = ({ data }: DescriptionProps) => {
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);

  const formRef = useRef<HTMLFormElement>(null);
  const quillRef = useRef<ReactQuill>(null);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      quillRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      disableEditing(); // 취소
    }
  };

  const { execute, fieldErrors } = useAction(updateCard, {
    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["card"],
      });
      toast.success(`Card "${data.title}" updated`);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 입력 값
    const editor = quillRef.current?.makeUnprivilegedEditor(
      quillRef.current.getEditor()
    );
    // 입력 값이 없는 경우 HTML 태그 제거를 위해 순수 텍스트값 확인
    const pureText = editor?.getText().trim() || "";
    const description = !pureText ? "" : editor?.getHTML();

    execute({
      id: data.id,
      boardId: data.list.boardId,
      listId: data.listId,
      description,
    });
  };

  useOnClickOutside(formRef, disableEditing);

  return (
    <div className='flex items-start gap-x-3 w-full'>
      <AlignLeft className='h-5 w-5 mt-0.5 text-[var(--kanban-text)]' />
      <div className='w-full'>
        <p className='font-semibold text-[var(--kanban-text)] mb-2'>
          Description
        </p>
        {isEditing ? (
          <form onSubmit={onSubmit} ref={formRef} className='space-y-2'>
            <Quill
              id='description'
              ref={quillRef}
              defaultValue={data.description}
              placeholder='Add a more detailed description'
              onKeyDown={onKeyDown}
              errors={fieldErrors}
            />
            <div className='flex items-center gap-x-2'>
              <FormSubmit>Save</FormSubmit>
              <Button
                type='button'
                onClick={disableEditing}
                size='sm'
                variant='ghost'
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div
            onClick={enableEditing}
            role='button'
            className={cn(
              "min-h-[78px] text-sm font-medium py-3 pr-3.5 rounded-md text-[var(--kanban-text)]",
              data.description ? "" : "bg-[var(--kanban-modal-btn)] pl-3.5"
            )}
            dangerouslySetInnerHTML={{
              __html:
                data.description || "<p>Add a more detailed description...</p>",
            }}
          ></div>
        )}
      </div>
    </div>
  );
};

Description.Skeleton = function DescriptionSkeleton() {
  return (
    <div className='flex items-start gap-x-3 w-full'>
      <Skeleton className='h-6 w-6 bg-neutral-200 dark:bg-neutral-500' />
      <div className='w-full'>
        <Skeleton className='w-24 h-6 mb-2 bg-neutral-200 dark:bg-neutral-500' />
        <Skeleton className='w-full h-[78px] bg-neutral-200 dark:bg-neutral-500' />
      </div>
    </div>
  );
};
