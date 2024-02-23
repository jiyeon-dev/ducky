import { deleteDoc, doc } from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { createActivityLog } from "../createActivityLog";
import { ACTION, ENTITY_TYPE } from "@/types";

// zod
const DeleteList = z.object({
  id: z.string(),
});

// types
type InputType = z.infer<typeof DeleteList>;
type ReturnType = ActionState<InputType, number>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let result = 0;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    // 삭제
    await deleteDoc(doc(db, "kanban", id));
    result = 1;

    // 로그 추가
    await createActivityLog({
      action: ACTION.DELETE,
      entityId: id,
      entityType: ENTITY_TYPE.LIST,
      entityTitle: "",
      userId: auth.currentUser?.uid || "",
      memo: "deleted this list",
    });
  } catch (e) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: result };
};

export const deleteList = fieldTypeChecker(DeleteList, handler);
