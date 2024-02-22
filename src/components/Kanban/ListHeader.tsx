"use client";

import { toast } from "sonner";
import { useEventListener } from "usehooks-ts";
import { useState, useRef } from "react";
import { useAction } from "@/hooks/useAction";
import { updateList } from "@/actions/kanban/updateList";
import { List } from "@/types";
import { FormInput } from "@/components/Kanban/form/formInput";
import { ListHeaderOptions } from "./ListHeaderOptions";

interface ListHeaderProps {
  data: List;
  onAddCard: () => void;
}

export const ListHeader = ({ data, onAddCard }: ListHeaderProps) => {
  const [title, setTitle] = useState(data.title);
  const [isEditing, setIsEditing] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const enableEditing = () => {
    setIsEditing(true);
  };

  const disableEditing = () => {
    setIsEditing(false);
  };

  const { execute } = useAction(updateList, {
    onSuccess: (data) => {
      toast.success(`Renamed to "${data.title}"`);
      setTitle(data.title);
      disableEditing();
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const handleSubmit = () => {
    const titleEl = inputRef.current as HTMLInputElement;
    const newTitle = titleEl.value.trim();

    // 값이 없거나, 변경 데이터와 같은 경우
    if (!newTitle || newTitle === data.title) {
      titleEl.value = title;
      disableEditing();
      return;
    }

    execute({
      title: newTitle,
      id: data.id,
      boardId: data.boardId,
    });
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") {
      handleSubmit();
    }
  };

  useEventListener("keydown", onKeyDown);

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
            className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent'
          />
        </div>
      ) : (
        <div
          onClick={enableEditing}
          className='w-full text-sm px-2.5 py-1 h-7 font-medium border-transparent'
        >
          {title}
        </div>
      )}
      <ListHeaderOptions onAddCard={onAddCard} data={data} />
    </div>
  );
};
