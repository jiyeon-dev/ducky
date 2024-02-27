import { z } from "zod";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { auth, db } from "@/lib/firebase";
import { doc, runTransaction } from "firebase/firestore";

// zod
const DeletePost = z.object({
  id: z.string().min(1, { message: "Post id is required" }),
});

// types
type InputType = z.infer<typeof DeletePost>;
type ReturnType = ActionState<InputType, number>;

const handler = async (data: InputType): Promise<ReturnType> => {
  const { id } = data;
  let result;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    await runTransaction(db, async (transaction) => {
      // 삭제하려는 게시물 조회
      const postRef = doc(db, "posts", id);
      const postDoc = await transaction.get(postRef);

      if (!postDoc.exists) throw new Error(`Cannot found Post! - ${id}`);
      if (postDoc.get("owner").uid !== user.uid) {
        throw new Error(`You do not have permission to delete. - ${id}`);
      }

      transaction.delete(postRef);
      result = 1;
    });
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to delete the post.",
    };
  }

  return { data: result };
};

export const deletePost = fieldTypeChecker(DeletePost, handler);
