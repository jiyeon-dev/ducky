import { ACTION, Card, ENTITY_TYPE, List } from "@/types";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import {
  Timestamp,
  arrayUnion,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { v4 as uuid } from "uuid";
import { createActivityLog } from "../createActivityLog";

// zod
const CreateCard = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title is too short",
    }),
  boardId: z.string(),
  listId: z.string(),
});

// types
type InputType = z.infer<typeof CreateCard>;
type ReturnType = ActionState<InputType, Partial<Card>>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, listId } = data;
  let card;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    // 현재 리스트에 속한 카드 리스트 조회
    const docSnapshot = await getDoc(doc(db, "kanban", listId));
    const cards = (docSnapshot.data() as List).cards || [];

    // 마지막 카드 번호 조회
    cards.sort((a, b) => a.order - b.order);
    const lastCard = cards.at(-1);
    const newOrder = lastCard ? lastCard.order + 1 : 1;

    // 카드 추가
    const cardId = uuid();
    await updateDoc(doc(db, "kanban", listId), {
      cards: arrayUnion({
        id: cardId,
        title,
        order: newOrder,
        listId: listId,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      }),
    });

    // 로그 추가
    await createActivityLog({
      action: ACTION.CREATE,
      entityId: cardId,
      entityType: ENTITY_TYPE.CARD,
      entityTitle: data.title,
      userId: auth.currentUser?.uid || "",
      memo: "created this card",
    });

    card = {
      id: cardId,
      title,
    };
  } catch (e) {
    return {
      error: "Failed to create.",
    };
  }

  return { data: card };
};

export const createCard = fieldTypeChecker(CreateCard, handler);
