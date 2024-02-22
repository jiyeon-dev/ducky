import { deleteDoc, doc } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";

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

  try {
    // 삭제
    await deleteDoc(doc(db, "kanban", id));
    result = 1;
  } catch (e) {
    return {
      error: "Failed to delete.",
    };
  }

  return { data: result };
};

export const deleteList = fieldTypeChecker(DeleteList, handler);
