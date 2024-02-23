import { db } from "@/lib/firebase";
import { ActivityLog } from "@/types";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

type Props = Omit<ActivityLog, "id" | "createdAt" | "updatedAt">;

export const createActivityLog = async (props: Props) => {
  try {
    const { action, entityId, entityType, entityTitle, userId, memo } = props;

    await addDoc(collection(db, "activity_log"), {
      action,
      entityId,
      entityType,
      entityTitle,
      userId,
      memo,
      createdAt: serverTimestamp(),
    });
  } catch (e) {
    console.error("[ACTIVITY_LOG_ERROR] ", e);
  }
};
