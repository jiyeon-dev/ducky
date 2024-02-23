import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { z } from "zod";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { ACTION, ENTITY_TYPE, List } from "@/types";
import { createActivityLog } from "../createActivityLog";

// zod
const CopyList = z.object({
  id: z.string(),
  boardId: z.string(),
});

// types
type InputType = z.infer<typeof CopyList>;
type ReturnType = ActionState<InputType, Partial<List>>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { id, boardId } = data;
  let list;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    // 선택한 리스트의 정보 조회
    const docRef = doc(db, "kanban", id);
    const docSnapshot = await getDoc(docRef);

    // 마지막 리스트 번호 조회
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
    const newTitle = `${docSnapshot.data()?.title} - copy`;
    const newDocRef = await addDoc(collection(db, "kanban"), {
      ...docSnapshot.data(),
      title: newTitle,
      order: newOrder,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    list = {
      id: newDocRef.id,
      title: newTitle,
      order: newOrder,
    };
  } catch (e) {
    return {
      error: "Failed to copy.",
    };
  }

  return { data: list };
};

export const copyList = fieldTypeChecker(CopyList, handler);
