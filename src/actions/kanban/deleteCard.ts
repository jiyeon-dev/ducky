import { arrayRemove, doc, runTransaction } from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { ACTION, Card, ENTITY_TYPE } from "@/types";
import { createActivityLog } from "../createActivityLog";

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

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    let title = "";
    await runTransaction(db, async (transaction) => {
      // 리스트 조회
      const listRef = doc(db, "kanban", listId);
      const listDoc = await transaction.get(listRef);

      // 현재 카드 정보 조회
      const curCard = listDoc.get("cards").find((card: Card) => card.id === id);
      title = curCard.title;

      // 현재 카드 삭제
      transaction.update(listRef, { cards: arrayRemove(curCard) });

      result = curCard;
    });

    // 로그 추가
    await createActivityLog({
      action: ACTION.DELETE,
      entityId: id,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: title,
      userId: auth.currentUser?.uid || "",
      memo: "deleted this card",
    });
  } catch (e) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: result };
};

export const deleteCard = fieldTypeChecker(DeleteCard, handler);
