import { useQuery } from "@tanstack/react-query";
import { doc, getDoc } from "firebase/firestore";
import { useCardModal } from "@/hooks/useCardModal";
import { Card, CardWithList } from "@/types";
import { db } from "@/lib/firebase";
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
  const id = useCardModal((state) => state.id);
  const listId = useCardModal((state) => state.listId);
  const isOpen = useCardModal((state) => state.isOpen);
  const onClose = useCardModal((state) => state.onClose);

  const { data: cardData, isPending } = useQuery<CardWithList>({
    queryKey: ["card", { id, listId }],
    queryFn: ({ queryKey }) => fetchCard({ ...(queryKey[1] as QueryKey) }),
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

  if (!isPending && !cardData) return <></>;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent
        className={
          "bg-[var(--kanban-modal-bg)] lg:max-w-screen-lg h-screen md:h-[90vh] flex flex-col"
        }
        onEscapeKeyDown={onEscapeKeyDown}
      >
        {!cardData ? <Header.Skeleton /> : <Header data={cardData} />}
        <div className='grid grid-cols-1 md:grid-cols-4 md:gap-4 overflow-y-auto'>
          <div className='col-span-3'>
            <div className='w-full space-y-6 overflow-y-auto'>
              {!cardData ? (
                <Description.Skeleton />
              ) : (
                <Description data={cardData} />
              )}
              {/* {!activityLogsData ? (
                <Activity.Skeleton />
              ) : (
                <Activity items={activityLogsData} />
              )} */}
              {!cardData ? <Activity.Skeleton /> : <Activity items={[]} />}
            </div>
          </div>
          {!cardData ? <Actions.Skeleton /> : <Actions data={cardData} />}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const fetchCard = async ({ id, listId }: QueryKey) => {
  try {
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
