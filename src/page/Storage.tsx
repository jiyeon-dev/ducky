import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { List } from "@/types";
import Kanban from "@/components/Kanban";
import { CardModal } from "@/components/Kanban/cardModal";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useQuery } from "@tanstack/react-query";
import { useCardModal } from "@/hooks/useCardModal";
import { useEffect, useState } from "react";
import { checkIsMobile } from "@/lib/utils";

interface QueryKey {
  boardId: string;
}

export default function StoragePage() {
  const [isMobile, setIsMobile] = useState(false);
  const isOpen = useCardModal((state) => state.isOpen);
  const { data: lists, isLoading } = useQuery({
    queryKey: ["storage", { boardId: "ducky" }],
    queryFn: ({ queryKey }) => fetchData({ ...(queryKey[1] as QueryKey) }),
  });

  useEffect(() => {
    setIsMobile(checkIsMobile());
  }, []);

  // const [lists, setLists] = useState<List[]>([]);
  // const [isLoading, setLoading] = useState<boolean>(false);

  // // 변경된 리스트/카드 정보 갖고오기
  // const fetchData = useCallback(() => {
  //   setLoading(true);
  //   const q = query(
  //     collection(db, "kanban"),
  //     where("boardId", "==", "ducky"),
  //     orderBy("order", "asc")
  //   );
  //   const unsubscribe = onSnapshot(q, (doc) => {
  //     const data = doc.docs.map(
  //       (item) => ({ ...item.data(), id: item.id } as List)
  //     );
  //     setLists(data);
  //   });

  //   setLoading(false);
  //   return unsubscribe;
  // }, []);

  // useEffect(() => {
  //   const unsubscribe = fetchData();
  //   return () => unsubscribe();
  // }, []);

  return (
    <>
      <div className='flex flex-col h-full'>
        {/* Title */}
        <div className='container flex items-center justify-center py-2 gap-2'>
          <div className='flex flex-col text-center'>
            <h1 className='sm:text-6xl text-4xl font-bold font-[TTHakgyoansimMulgyeolB]'>
              더키 저장소
            </h1>
            <span className='text-gray-500 text-sm mt-3 font-[GmarketSansMedium]'>
              지식 공유 아카이브
            </span>
          </div>
        </div>

        {/* body */}
        <div className='p-4 h-full overflow-x-auto'>
          {isLoading && <LoadingSpinner />}
          {!isLoading && <Kanban data={lists || []} boardId='ducky' />}
        </div>
      </div>

      {isOpen && <CardModal isMobile={isMobile} />}
    </>
  );
}

const fetchData = async ({ boardId }: QueryKey) => {
  const q = query(
    collection(db, "kanban"),
    where("boardId", "==", boardId),
    orderBy("order", "asc")
  );

  const querySnapshot = await getDocs(q);
  const data = querySnapshot.docs.map((item) => {
    const sortedCard = item
      .data()
      .cards.sort(
        (a: { order: number }, b: { order: number }) => a.order - b.order
      );
    return { ...item.data(), cards: sortedCard, id: item.id } as List;
  });
  return data;
};
