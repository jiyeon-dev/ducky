import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { db } from "@/lib/firebase";
import { Card } from "@/types";
import {
  arrayRemove,
  arrayUnion,
  doc,
  runTransaction,
} from "firebase/firestore";
import { z } from "zod";

// zod
const UpdateCard = z.object({
  boardId: z.string(),
  listId: z.string(),
  description: z.optional(
    z.string()
    // z
    //   .string({
    //     required_error: "Description is required",
    //     invalid_type_error: "Description is required",
    //   })
    //   .min(10, {
    //     message: "Description is too short.",
    //   })
  ),
  title: z.optional(
    z
      .string({
        required_error: "Title is required",
        invalid_type_error: "Title is required",
      })
      .min(1, {
        message: "Title is too short",
      })
  ),
  id: z.string(),
});

// types
type InputType = z.infer<typeof UpdateCard>;
type ReturnType = ActionState<InputType, Card>;

// hander
const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, listId, ...values } = data;
  let card;

  try {
    await runTransaction(db, async (transaction) => {
      // 리스트 조회
      const listRef = doc(db, "kanban", listId);
      const listDoc = await transaction.get(listRef);

      // 현재 카드 정보 조회
      const curCard = listDoc.get("cards").find((card: Card) => card.id === id);

      // 변경된 새 카드
      const newCard = { ...curCard, ...values };

      transaction.update(listRef, { cards: arrayRemove(curCard) }); // 현재 카드 삭제
      transaction.update(listRef, { cards: arrayUnion(newCard) }); // 현재 카드 추가

      card = newCard;
    });
  } catch (error) {
    return {
      error: "Failed to update.",
    };
  }
  return { data: card };
};

export const updateCard = fieldTypeChecker(UpdateCard, handler);
