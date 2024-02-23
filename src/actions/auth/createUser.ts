/**
 * [Docs] FireBase Auth 오류 코드
 * https://firebase.google.com/docs/auth/admin/errors?hl=ko
 */
import { z } from "zod";
import {
  User,
  createUserWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth, db } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { AVATAR_LIST } from "@/constant/avatar";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { FirebaseError } from "firebase/app";

// zod
const CreateUser = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("Invalid email address."),
  password: z.string().min(6, {
    message: "Password is too short. Please enter at least 6 characters.",
  }),
  username: z.string().min(2, { message: "This field has to be filled." }),
  avatar: z.string().min(1, { message: "Please select an avatar." }),
});

// types
type InputType = z.infer<typeof CreateUser>;
type ReturnType = ActionState<InputType, User>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { email, password, username, avatar } = data;
  let user;

  try {
    // 이미 사용중인 username 인지 확인
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size > 0) {
      throw new Error("The username is already in use.");
    }

    // 계정 생성
    const response = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    // 아바타 이미지 정보 조회
    let photoURL;
    const img = AVATAR_LIST.find((item) => item.id === avatar);
    if (img) photoURL = img.url;
    else AVATAR_LIST[0].url;

    // 유저 정보 업데이트
    await updateProfile(response.user, {
      displayName: username,
      photoURL,
    });

    // firestore 에 유저 정보 저장
    await setDoc(doc(db, "users", response.user.uid), {
      uid: response.user.uid,
      displayName: username,
      email,
      photoURL,
    });

    user = response.user;
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
      return { error: "Failed to create user." };
    }
  }

  return { data: user };
};

export const createUser = fieldTypeChecker(CreateUser, handler);
