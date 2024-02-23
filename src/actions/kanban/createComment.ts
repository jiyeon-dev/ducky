import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";

// zod
const CreateComment = z.object({
  message: z
    .string({
      required_error: "Message is required",
    })
    .min(1, {
      message: "Title is too short",
    }),
  cardId: z.string(),
});

// types
type InputType = z.infer<typeof CreateComment>;
type ReturnType = ActionState<InputType, string>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { message, cardId } = data;
  let result;
  const user = auth.currentUser;
  const anonymous = {
    uid: Date.now(),
    photoURL: "",
    displayName: `익명-${Date.now()}`,
  }; // 익명 유저

  try {
    const docRef = await addDoc(collection(db, "comment"), {
      cardId,
      message,
      createdAt: serverTimestamp(),
      user: {
        uid: user ? user.uid : anonymous.uid,
        photoURL: user ? user.photoURL : anonymous.photoURL,
        displayName: user ? user.displayName : anonymous.displayName,
      },
    });

    result = docRef.id;
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to create comment.",
    };
  }

  return { data: result };
};

export const createComment = fieldTypeChecker(CreateComment, handler);
