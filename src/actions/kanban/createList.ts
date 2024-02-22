import { List } from "@/types";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import {
  addDoc,
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { db } from "@/lib/firebase";

// zod
const CreateList = z.object({
  title: z
    .string({
      required_error: "Title is required",
      invalid_type_error: "Title is required",
    })
    .min(1, {
      message: "Title is too short",
    }),
  boardId: z.string(),
});

// types
type InputType = z.infer<typeof CreateList>;
type ReturnType = ActionState<InputType, Partial<List>>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { boardId } = data;
  let list;

  try {
    // 마지막 리스트 번호 확인
    const q = query(
      collection(db, "kanban"),
      where("boardId", "==", boardId),
      orderBy("order", "desc"),
      limit(1)
    );
    const querySnapshot = await getDocs(q);
    const newOrder =
      querySnapshot.size > 0 ? querySnapshot.docs[0].data().order + 1 : 1;

    // 추가
    const docRef = await addDoc(collection(db, "kanban"), {
      ...data,
      order: newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    list = {
      id: docRef.id,
      cards: [],
      ...data,
    };
  } catch (e) {
    return {
      error: "Failed to create.",
    };
  }

  return { data: list };
};

export const createList = fieldTypeChecker(CreateList, handler);
