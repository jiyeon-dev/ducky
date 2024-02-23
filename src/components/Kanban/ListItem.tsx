import { useCallback, useRef, useState } from "react";
import { Draggable, Droppable } from "@hello-pangea/dnd";
import { cn } from "@/lib/utils";
import { ListWithCards } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { ListHeader } from "./ListHeader";
import { CardForm } from "./CardForm";
import { CardItem } from "./CardItem";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";
import { AddCardButton } from "./AddCardButton";

interface ListItemProps {
  data: ListWithCards;
  index: number;
}

export default function ListItem({ data, index }: ListItemProps) {
  const user = useAuth();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isEditing, setIsEditing] = useState(false);

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => listScrollToBottom());
  };
  const disableEditing = () => {
    setIsEditing(false);
  };

  const listScrollToBottom = useCallback(() => {
    const scroll = scrollRef.current as HTMLDivElement;
    const scrollBody = scroll.querySelector(
      "div[data-radix-scroll-area-viewport] ol"
    );
    if (scrollBody)
      scrollBody.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
  }, [scrollRef]);

  return (
    <Draggable draggableId={data.id} index={index} isDragDisabled={!user}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className='shrink-0 h-full w-[272px] select-none'
        >
          <div
            {...provided.dragHandleProps}
            className='w-full rounded-md shadow-md pb-2 bg-[var(--kanban-list-bg)] flex flex-col'
            style={{ height: "inherit" }}
          >
            <ListHeader data={data} onAddCard={enableEditing} />
            <Droppable droppableId={data.id} type='card'>
              {(provided) => (
                <ScrollArea ref={scrollRef}>
                  <ol
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className={cn(
                      "mx-1 px-1 py-0.5 flex flex-col gap-y-2",
                      data.cards?.length > 0 ? "mt-2" : "mt-0"
                    )}
                  >
                    {data.cards?.map((card, index) => (
                      <CardItem
                        key={card.id}
                        listId={data.id}
                        index={index}
                        data={card}
                      />
                    ))}
                    {isEditing && (
                      <CardForm
                        listId={data.id}
                        boardId={data.boardId}
                        isEditing={isEditing}
                        disableEditing={disableEditing}
                        onListScrollToBottom={listScrollToBottom}
                      />
                    )}
                    {provided.placeholder}
                  </ol>
                  <ScrollBar orientation='vertical' />
                </ScrollArea>
              )}
            </Droppable>
            {!isEditing && user && (
              <AddCardButton enableEditing={enableEditing} />
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}
