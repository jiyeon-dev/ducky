import { Card } from "@/types";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import {
  arrayUnion,
  doc,
  deleteField,
  runTransaction,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";

// zod
export const UpdateCardOrder = z.object({
  listId1: z.string(),
  items1: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
    })
  ),
  listId2: z.string(),
  items2: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
      listId: z.string(),
    })
  ),
  boardId: z.string(),
});

// types
type InputType = z.infer<typeof UpdateCardOrder>;
type ReturnType = ActionState<InputType, Partial<Card>[]>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { listId1, items1, listId2, items2 } = data;
  let cards;

  try {
    await runTransaction(db, async (transaction) => {
      // 리스트 1 업데이트
      const list1Ref = doc(db, "kanban", listId1);
      transaction.update(list1Ref, { cards: deleteField() });
      transaction.update(list1Ref, { cards: arrayUnion(...items1) });

      // 리스트 2 업데이트
      const list2Ref = doc(db, "kanban", listId2);
      transaction.update(list2Ref, { cards: deleteField() });
      transaction.update(list2Ref, { cards: arrayUnion(...items2) });
    });
    cards = items2;
    // });
  } catch (e) {
    return {
      error: "Failed to reorder.",
    };
  }

  return { data: cards };
};

export const updateCardOrder = fieldTypeChecker(UpdateCardOrder, handler);
