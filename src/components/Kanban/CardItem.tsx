"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/types";

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role='button'
          className='w-[256px] truncate border-2 border-transparent bg-[var(--kanban-bg)] hover:border-[var(--kanban-border-focus)] text-[var(--kanban-text)] py-2 px-3 text-sm rounded-md shadow-sm h-min-[40px]'
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
