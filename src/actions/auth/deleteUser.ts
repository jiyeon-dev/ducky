/**
 * [Docs] FireBase Auth 오류 코드
 * https://firebase.google.com/docs/auth/admin/errors?hl=ko
 */
import { z } from "zod";
import { EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import {
  collection,
  doc,
  getDocs,
  query,
  runTransaction,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

// zod
const DeleteUser = z.object({});

// types
type InputType = z.infer<typeof DeleteUser>;
type ReturnType = ActionState<InputType, boolean>;

// handler
const handler = async (): Promise<ReturnType> => {
  let result = false;

  try {
    const randomNum = new Date().getTime();
    const user = auth.currentUser;
    if (!user) return { error: "Cannot found user!" };

    await runTransaction(db, async (transaction) => {
      // 작성한 게시물 모두 익명으로 변경
      const q = query(
        collection(db, "posts"),
        where("owner.uid", "==", user.uid)
      );
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const postRef = doc.ref;
        transaction.update(postRef, {
          owner: {
            photoURL: "",
            uid: "",
            displayName: `${user.displayName}-${randomNum}`,
          },
        });
      });

      // 작성한 댓글 모두 익명으로 변경
      const q2 = query(
        collection(db, "comment"),
        where("user.uid", "==", user.uid)
      );
      const querySnapshot2 = await getDocs(q2);
      querySnapshot2.forEach((doc) => {
        const postRef = doc.ref;
        transaction.update(postRef, {
          user: {
            photoURL: "",
            uid: "",
            displayName: `${user.displayName}-${randomNum}}`,
          },
        });
      });

      // firestore 에 유저 정보 삭제
      transaction.delete(doc(db, "users", user.uid));
    });

    // 계정 삭제
    await user?.delete();

    result = true;
  } catch (e) {
    /**
     * message => Firebase: Error (auth/email-already-in-use).
     * code => auth/email-already-in-use
     * name => FirebaseError
     */
    if (e instanceof FirebaseError) {
      return { error: e.code };
    } else if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "Failed to delete user." };
    }
  }

  return { data: result };
};

export const deleteUser = fieldTypeChecker(DeleteUser, handler);
