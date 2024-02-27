/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { DragDropContext, Droppable } from "@hello-pangea/dnd";
import { AddListForm } from "@/components/Kanban/AddListForm";
import ListItem from "./ListItem";
import { List } from "@/types";
import { useAction } from "@/hooks/useAction";
import { toast } from "sonner";
import { updateListOrder } from "@/actions/kanban/updateListOrder";
import { updateCardOrder } from "@/actions/kanban/updateCardOrder";
import { useAuth } from "@/hooks/useAuth";
import { useQueryClient } from "@tanstack/react-query";

interface KanbanProps {
  data: List[];
  boardId: string;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
  const result = Array.from(list); // 배열 얕은 복사
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);
  return result;
}

export default function Kanban({ data, boardId }: KanbanProps) {
  const queryClient = useQueryClient();
  const user = useAuth();
  const [orderedData, setOrderedData] = useState(data); // db 저장 전 저장해서 보여주기 위해 생성

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  const { execute: executeUpdateListOrder } = useAction(updateListOrder, {
    onSuccess: () => {
      toast.success("List reordered.");
      queryClient.invalidateQueries({ queryKey: ["storage"] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const { execute: executeUpdateCardOrder } = useAction(updateCardOrder, {
    onSuccess: () => {
      toast.success("Card reordered.");
      queryClient.invalidateQueries({ queryKey: ["storage"] });
    },
    onError: (error) => {
      toast.error(error);
    },
  });

  const onDragEnd = (result: any) => {
    const { destination, source, type } = result;
    if (!destination) return;

    // 조건1. 같은 장소에 drop한 경우
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    // 조건2. list 이동한 경우
    if (type === "list") {
      const items = reorder(orderedData, source.index, destination.index).map(
        (item, index) => ({
          ...item,
          order: index,
        })
      );
      setOrderedData(items);
      executeUpdateListOrder({ items, boardId, id: source.droppableId });
    }

    // 조건3. card 이동한 경우
    if (type === "card") {
      const newOrderedData = [...orderedData];
      const sourceList = newOrderedData.find(
        (list) => list.id === source.droppableId
      );
      const destList = newOrderedData.find(
        (list) => list.id === destination.droppableId
      );

      if (!sourceList || !destList) return;

      // 카드가 없는 경우
      if (!sourceList.cards) sourceList.cards = [];
      if (!destList.cards) destList.cards = [];

      // 같은 리스트에 카드를 옮긴 경우
      if (destination.droppableId === source.droppableId) {
        const movedCard = sourceList.cards[source.index]; // 변경할 카드
        const reorderedCards = reorder(
          sourceList.cards,
          source.index,
          destination.index
        );

        reorderedCards.forEach((card, index) => {
          card.order = index;
        });
        sourceList.cards = reorderedCards;
        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          items1: sourceList.cards,
          listId1: source.droppableId,
          items2: sourceList.cards,
          listId2: destination.droppableId,
          boardId,
          id: movedCard.id,
        });
      } else {
        // source 리스트에서 카드 제거후 movedCard에 저장
        const [movedCard] = sourceList.cards.splice(source.index, 1);

        // movedCard에 id를 목적지(destination) id로 변경
        movedCard.listId = destination.droppableId;

        // 목적지 리스트에 추가
        destList.cards.splice(destination.index, 0, movedCard);

        // 순서 변경
        sourceList.cards.forEach((card, idx) => {
          card.order = idx;
        });
        destList.cards.forEach((card, idx) => {
          card.order = idx;
        });

        setOrderedData(newOrderedData);
        executeUpdateCardOrder({
          items1: sourceList.cards,
          listId1: source.droppableId,
          items2: destList.cards,
          listId2: destination.droppableId,
          boardId,
          id: movedCard.id,
        });
      }
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId='lists' type='list' direction='horizontal'>
        {(provided) => (
          <ol
            {...provided.droppableProps}
            ref={provided.innerRef}
            className='flex gap-x-3 h-full'
          >
            {orderedData.map((list, index) => (
              <ListItem key={list.id} index={index} data={list} />
            ))}
            {provided.placeholder}
            {/* 새 리스트 추가 폼 */}
            {user && <AddListForm />}
            <div className='flex-shrink-0 w-1' />
          </ol>
        )}
      </Droppable>
    </DragDropContext>
  );
}
