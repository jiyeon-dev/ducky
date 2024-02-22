import { arrayRemove, doc, runTransaction } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { Card } from "@/types";

// zod
export const DeleteCard = z.object({
  id: z.string(),
  listId: z.string(),
});

// types
type InputType = z.infer<typeof DeleteCard>;
type ReturnType = ActionState<InputType, Card>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, listId } = data;
  let result;

  try {
    await runTransaction(db, async (transaction) => {
      // 리스트 조회
      const listRef = doc(db, "kanban", listId);
      const listDoc = await transaction.get(listRef);

      // 현재 카드 정보 조회
      const curCard = listDoc.get("cards").find((card: Card) => card.id === id);
      console.log(curCard);

      // 현재 카드 삭제
      transaction.update(listRef, { cards: arrayRemove(curCard) });

      result = curCard;
    });
  } catch (e) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: result };
};

export const deleteCard = fieldTypeChecker(DeleteCard, handler);
