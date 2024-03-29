"use client";

import { toast } from "sonner";
import { useState, useRef } from "react";
import { useAction } from "@/hooks/useAction";
import { updateList } from "@/actions/kanban/updateList";
import { List } from "@/types";
import { FormInput } from "@/components/Kanban/form/formInput";
import { ListHeaderOptions } from "./ListHeaderOptions";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const user = useAuth();
  const queryClient = useQueryClient();
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    if (!user) return;
    setIsEditing(true);
    setTimeout(() => {
      inputRef.current?.focus();
    });
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      queryClient.invalidateQueries({ queryKey: ["storage"] });
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = () => {
    if (!user) return;
    const titleEl = inputRef.current as HTMLInputElement;
    const newTitle = titleEl?.value.trim();

    // 값이 없거나, 변경 데이터와 같은 경우
    if (!newTitle || newTitle === data.title) {
      if (titleEl) titleEl.value = title;
      disableEditing();
      return;
    }

    execute({
      title: newTitle,
      id: data.id,
      boardId: data.boardId,
    });
  };

  const onKeyDown = (event: React.KeyboardEvent) => {
    console.log("list header");
    if (event.key === "Escape") {
      handleSubmit();
    }
  };

  return (
    <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-center gap-x-2'>
      {isEditing ? (
        <div className='flex-1 px-[2px]'>
          <FormInput
            ref={inputRef}
            onBlur={handleSubmit}
            id='title'
            placeholder='Enter list title..'
            defaultValue={title}
            onKeyDown={onKeyDown}
            className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent'
          />
        </div>
      ) : (
        <div
          onClick={enableEditing}
          className='w-full text-sm px-2.5 py-1 h-7 font-bold border-transparent'
        >
          {title}
        </div>
      )}
      {user && <ListHeaderOptions onAddCard={onAddCard} data={data} />}
    </div>
  );
};
