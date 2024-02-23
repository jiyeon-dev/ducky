/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQueries } from "@tanstack/react-query";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useCardModal } from "@/hooks/useCardModal";
import { ActivityLog, Card } from "@/types";
import { db } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";
import { Dialog } from "@radix-ui/react-dialog";
import { DialogContent } from "@/components/ui/dialog";
import { Header } from "./Header";
import { Description } from "./description";
import { Actions } from "./Actions";
import { Activity } from "./Activity";

interface QueryKey {
  id: string;
  listId: string;
}

export const CardModal = () => {
  const user = useAuth();
  const id = useCardModal((state) => state.id);
  const listId = useCardModal((state) => state.listId);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const result = useQueries({
    queries: [
      {
        queryKey: ["card", { id, listId }],
        queryFn: ({ queryKey }: any) =>
          fetchCard({ ...(queryKey[1] as QueryKey) }),
      },
      {
        queryKey: ["activity_log", { id, listId }],
        queryFn: ({ queryKey }: any) =>
          fetchActivityLog({ ...(queryKey[1] as QueryKey) }),
      },
    ],
  });

  const onEscapeKeyDown = (e: KeyboardEvent) => {
    e.preventDefault();

    // form 안의 요소에서 esc누른 경우 각각의 input 마다 핸들러가 있기 때문에 무시
    if ((e.target as HTMLElement).closest("form")) {
      return;
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          "bg-[var(--kanban-modal-bg)] lg:max-w-screen-md h-screen md:h-[90vh] flex flex-col"
        }
        onEscapeKeyDown={onEscapeKeyDown}
      >
        {result[0].isLoading ? (
          <Header.Skeleton />
        ) : (
          <Header data={result[0].data || []} user={user} />
        )}
        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4 overflow-y-auto'>
          <div className={user ? "col-span-3" : "col-span-4"}>
            <div className='w-full space-y-6 overflow-y-auto'>
              {result[0].isLoading ? (
                <Description.Skeleton />
              ) : (
                <Description data={result[0].data || []} user={user} />
              )}
              {result[1].isLoading ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={(result[1].data as []) || []} />
              )}
            </div>
          </div>
          {user ? (
            result[0].isLoading ? (
              <Actions.Skeleton />
            ) : (
              <Actions data={result[0].data} />
            )
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const fetchCard = async ({ id, listId }: QueryKey) => {
  try {
    if (!id || !listId) return {};

    // array 안의 object key로는 검색이 안되기 떄문에, list 먼저 찾고 그 안에서 검색하도록 함
    const docRef = doc(db, "kanban", listId);
    const docSnapshot = await getDoc(docRef);
    const cards = docSnapshot.get("cards");
    return {
      ...cards.find((card: Card) => card.id === id),
      list: docSnapshot.data(),
    };
  } catch (error) {
    throw new Error("Error fetching Firestore data: " + error);
  }
};

const fetchActivityLog = async ({ id, listId }: QueryKey) => {
  try {
    if (!id || !listId) return {};
    const q = query(
      collection(db, "activity_log"),
      where("entityId", "==", id),
      orderBy("createdAt", "desc")
    );
    const querySnapshot = await getDocs(q);

    const userIdList = new Set<string>(); // 유저 상세 정보 조회를 위해 유저 id 담음.
    const data = querySnapshot.docs.map((item) => {
      userIdList.add(item.data().userId);
      return {
        ...item.data(),
        id: item.id,
      } as ActivityLog;
    });

    // 유저 상세 정보 조회
    const docSnapshot = await getDocs(
      query(collection(db, "users"), where("uid", "in", Array.from(userIdList)))
    );
    const userData = docSnapshot.docs.map((item) => ({
      userId: item.id,
      displayName: item.data().displayName,
      photoURL: item.data().photoURL,
    }));

    // 로그에 유저 정보 바인딩
    const newData = data.map((d) => {
      const userInfo = userData.find((u) => u.userId === d.userId);
      return {
        ...d,
        user: userInfo || {},
      };
    });
    return newData;
  } catch (error) {
    throw new Error("Error fetching Firestore data: " + error);
  }
};
