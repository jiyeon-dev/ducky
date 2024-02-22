import Kanban from "@/components/Kanban";
import {
  QueryDocumentSnapshot,
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useEffect, useState } from "react";
import { List } from "@/types";

export default function StoragePage() {
  const [lists, setLists] = useState<List[]>([]);
  console.log("---------rerender");
  useEffect(() => {
    const q = query(
      collection(db, "kanban"),
      where("boardId", "==", "ducky"),
      orderBy("order", "asc")
    );

    onSnapshot(q, (doc) => {
      const data = doc.docs.map(
        (item) => ({ ...item.data(), id: item.id } as List)
      );
      setLists(data);
    });
  }, []);

  return (
    <div className='flex flex-col h-full'>
      {/* Title */}
      <div className='container flex items-center justify-center py-2 gap-2'>
        <div className='flex flex-col text-center'>
          <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
            고무오리 저장소
          </h1>
          <span className='text-gray-500 text-sm mt-3 font-[GmarketSansMedium]'>
            고무오리 멤버라면 누구나 쓰고 수정할 수 있습니다.
          </span>
        </div>
      </div>

      {/* body */}
      <div className='p-4 h-full overflow-x-auto'>
        <Kanban data={lists} boardId='ducky' />
      </div>
    </div>
  );
}
