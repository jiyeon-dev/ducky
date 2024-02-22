"use client";

import { Card } from "@/types";

interface CardItemProps {
  data: Card;
  index: number;
}

export const CardItem = ({ data, index }: CardItemProps) => {
  return (
    <div
      role='button'
      className='truncate border-2 border-transparent bg-[var(--kanban-bg)] hover:border-[var(--kanban-border-focus)] text-[var(--kanban-text)] py-2 px-3 text-sm rounded-md shadow-sm'
    >
      {data.title}
    </div>
  );
};
