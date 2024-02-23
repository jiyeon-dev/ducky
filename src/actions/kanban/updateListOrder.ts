import { doc, serverTimestamp, writeBatch } from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { ACTION, ENTITY_TYPE, List } from "@/types";
import { createActivityLog } from "../createActivityLog";

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
  id: z.string(),
});

// types
type InputType = z.infer<typeof UpdateListOrder>;
type ReturnType = ActionState<InputType, Partial<List>[]>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { items, id } = data;
  let lists;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

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

    // 로그 추가
    await createActivityLog({
      action: ACTION.MOVED,
      entityId: id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: "",
      userId: auth.currentUser?.uid || "",
      memo: "moved this list",
    });
  } catch (e) {
    return {
      error: "Failed to reorder.",
    };
  }

  return { data: lists };
};

export const updateListOrder = fieldTypeChecker(UpdateListOrder, handler);
