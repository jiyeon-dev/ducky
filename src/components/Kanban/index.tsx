import { useEffect, useState } from "react";
import { QueryDocumentSnapshot } from "firebase/firestore";
import { AddListForm } from "@/components/Kanban/AddListForm";
import ListItem from "./ListItem";
import { ListWithCards } from "@/types";

interface KanbanProps {
  data: QueryDocumentSnapshot[];
  // boardId: string;
}

export default function Kanban({ data }: KanbanProps) {
  const [orderedData, setOrderedData] = useState(data); // db 저장 전 저장해서 보여주기 위해 생성

  useEffect(() => {
    setOrderedData(data);
  }, [data]);

  return (
    <ol className='flex gap-x-3 h-full'>
      {orderedData.map((list, index) => (
        <ListItem
          key={list.id}
          index={index}
          data={{ ...list.data(), id: list.id } as ListWithCards}
        />
      ))}

      {/* 새 리스트 추가 폼 */}
      <AddListForm />
      <div className='flex-shrink-0 w-1' />
    </ol>
  );
}
