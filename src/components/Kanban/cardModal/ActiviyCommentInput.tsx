import React, { ChangeEvent, useRef, useState } from "react";
import { createComment } from "@/actions/kanban/createComment";
import { useAction } from "@/hooks/useAction";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { FormTextarea } from "../form/formTextarea";
import { FormSubmit } from "../form/formSubmit";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { useCardModal } from "@/hooks/useCardModal";

export default function ActivityCommentInput() {
  const cardId = useCardModal((state) => state.id);
  const formRef = useRef<HTMLFormElement>(null);
  const [disabled, setDisabled] = useState(true);
  const user = useAuth();
  const queryClient = useQueryClient();

  const { execute } = useAction(createComment, {
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["comment"] });
      toast.success(`Created comment.`, { id: cardId });
      formRef.current?.reset();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!cardId) return;
    history.pushState({}, "", location.pathname);

    const formData = new FormData(e.target as HTMLFormElement);
    const description = (formData.get("description") as string).trim();
    if (!description) return;

    execute({
      message: description,
      cardId,
    });
  };

  const handleInput = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = event.target;
    if (textarea.value.trim()) {
      setDisabled(false);
    } else {
      setDisabled(true);
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

  return (
    <li className='flex items-start gap-x-2 md:mr-0 mr-4'>
      <Avatar className='h-8 w-8'>
        {/* 로그인 유저 이미지 */}
        <AvatarImage src={user?.photoURL || ""} alt={user?.displayName || ""} />
        <AvatarFallback className='bg-yellow-400 text-sm'>
          {user?.displayName || "익명"}
        </AvatarFallback>
      </Avatar>
      <div className='flex flex-col space-y-0.5 flex-1 mr-4 break-words'>
        <form ref={formRef} className='space-y-2' onSubmit={onSubmit}>
          <FormTextarea
            id='description'
            className='w-full text-[var(--kanban-text)] bg-[var(--kanban-bg)] border-transparent'
            placeholder='Write a comment...'
            defaultValue=''
            onInput={handleInput}
            onKeyDown={onTextareaKeyDown}
            // errors={fieldErrors}
          />
          <div className='flex items-center gap-x-2'>
            <FormSubmit disabled={disabled}>Save</FormSubmit>
          </div>
        </form>
      </div>
    </li>
  );
}
