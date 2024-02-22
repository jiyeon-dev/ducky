import { useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { ListHeader } from "./ListHeader";
import { CardForm } from "./CardForm";
import { CardItem } from "./CardItem";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export default function ListItem({ data, index }: ListItemProps) {
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  return (
    <Draggable draggableId={data.id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className='shrink-0 h-full w-[272px] select-none'
        >
          <div
            {...provided.dragHandleProps}
            className='w-full rounded-md shadow-md pb-2 bg-[var(--kanban-list-bg)]'
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type='card'>
              {(provided) => (
                <ol
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className={cn(
                    "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                    data.cards?.length > 0 ? "mt-2" : "mt-0"
                  )}
                >
                  {data.cards?.map((card, index) => (
                    <CardItem key={card.id} index={index} data={card} />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data.id}
              boardId={data.boardId}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  );
}
