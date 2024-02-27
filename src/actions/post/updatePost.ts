import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { doc, serverTimestamp, updateDoc } from "firebase/firestore";
import { z } from "zod";
import { auth, db, storage } from "@/lib/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { CreatePost } from "./createPost";

// zod
const UpdatePost = CreatePost.merge(
  z.object({
    postId: z.string().min(1, { message: "Post Id is required" }),
    isImageChanged: z.boolean(),
    originMainImageUrl: z.string().optional(),
  })
);

// types
type InputType = z.infer<typeof UpdatePost>;
type ReturnType = ActionState<InputType, string>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  let postId;

  const user = auth.currentUser;
  if (!user)
    return {
      error: "Unauthenticated user.",
    };

  try {
    // [이미지]
    console.log(data.isImageChanged);
    let imageUrl;
    const imageFile = data.mainImageFile;
    // 이미지가 신규 추가된 경우
    if (imageFile && imageFile.size !== 0) {
      const filename = imageFile.name + "_" + new Date().getTime();
      const storageRef = ref(storage, `posts/${filename}`);
      const upload = await uploadBytesResumable(storageRef, imageFile);
      imageUrl = await getDownloadURL(upload.ref);
    }
    // 신규 추가된 이미지가 없는 경우 -> 이전 이미지 추가
    else if (imageFile && imageFile.size === 0 && !data.isImageChanged) {
      imageUrl = data.originMainImageUrl;
    }
    // 기존 이미지를 삭제한 경우
    else {
      imageUrl = "";
    }

    // [수정]
    await updateDoc(doc(db, "posts", data.postId), {
      title: data.title,
      description: data.description,
      content: data.content,
      categoryId: data.categoryId,
      tags: data.tags,
      owner: {
        photoURL: user.photoURL,
        displayName: user.displayName,
        uid: user.uid,
      },
      // imageUrl,
      mainImageUrl: imageUrl,
      updatedAt: serverTimestamp(),
    });

    postId = data.postId;
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to update the post.",
    };
  }

  try {
    // 기존 이미지 삭제
    if (data.isImageChanged) {
      const imageRef = ref(storage, data.originMainImageUrl);
      await deleteObject(imageRef);
    }
  } catch (e) {
    //
  }
  return { data: postId };
};

export const updatePost = fieldTypeChecker(UpdatePost, handler);
