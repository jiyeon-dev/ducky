import { Draggable } from "@hello-pangea/dnd";
import { Card } from "@/types";
import { useCardModal } from "@/hooks/useCardModal";
import { useAuth } from "@/hooks/useAuth";

interface CardItemProps {
  data: Card;
  listId: string;
  index: number;
}

export const CardItem = ({ data, listId, index }: CardItemProps) => {
  const user = useAuth();
  const { onOpen } = useCardModal();

  return (
    <Draggable draggableId={data.id} index={index} isDragDisabled={!user}>
      {(provided) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          role='button'
          onClick={() => onOpen(data.id, listId)}
          className='w-[256px] whitespace-pre-line block overflow-hidden break-words border-2 border-transparent bg-[var(--kanban-bg)] hover:border-[var(--kanban-border-focus)] text-[var(--kanban-text)] py-2 px-3 text-sm rounded-md shadow-sm '
        >
          {data.title}
        </div>
      )}
    </Draggable>
  );
};
