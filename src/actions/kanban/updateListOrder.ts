import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { List } from "@/types";

// zod
const UpdateListOrder = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      order: z.number(),
    })
  ),
  boardId: z.string(),
});

// types
type InputType = z.infer<typeof UpdateListOrder>;
type ReturnType = ActionState<InputType, Partial<List>[]>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { items } = data;
  let lists;

  try {
    const batch = writeBatch(db);
    items.map((item) => {
      batch.update(doc(db, "kanban", item.id), {
        order: item.order,
        updatedAt: serverTimestamp(),
      });
    });
    await batch.commit();
    lists = [...items];
  } catch (e) {
    return {
      error: "Failed to reorder.",
    };
  }

  return { data: lists };
};

export const updateListOrder = fieldTypeChecker(UpdateListOrder, handler);
