import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";

// zod
const UpdateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title is too short",
    }),
  id: z.string(),
  boardId: z.string(),
});

// types
type InputType = z.infer<typeof UpdateList>;
type ReturnType = ActionState<InputType, { title: string }>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { title, id } = data;
  let list;

  try {
    // 수정
    await updateDoc(doc(db, "kanban", id), {
      title,
      updatedAt: serverTimestamp(),
    });

    list = { title };
  } catch (e) {
    return {
      error: "Failed to update.",
    };
  }

  return { data: list };
};

export const updateList = fieldTypeChecker(UpdateList, handler);
