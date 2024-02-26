import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { z } from "zod";
import { auth, db, storage } from "@/lib/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// zod
const CreatePost = z.object({
  title: z.string().min(1, { message: "Title is required" }).max(100, {
    message: "Title is too long. (max: 100)",
  }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(200, {
      message: "Description is too long. (max: 200)",
    }),
  content: z.string(),
  // .min(1, {
  //   message: "Content is required",
  // }),
  categoryId: z
    .string({
      required_error: "Category is required",
    })
    .min(1, {
      message: "Category is required",
    }),
  tags: z.array(z.string()).optional(),
  mainImageFile: z.instanceof(File).optional(),
});

// types
type InputType = z.infer<typeof CreatePost>;
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
    // 이미지 추가
    let imageUrl;
    const imageFile = data.mainImageFile;
    if (imageFile && imageFile.size !== 0) {
      const filename = imageFile.name + "_" + new Date().getTime();
      const storageRef = ref(storage, `posts/${filename}`);
      const upload = await uploadBytesResumable(storageRef, imageFile);
      imageUrl = await getDownloadURL(upload.ref);
    }

    console.log(imageUrl);

    // 추가
    const docRef = await addDoc(collection(db, "posts"), {
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
      mainImageUrl: imageUrl || "",
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    postId = docRef.id;
  } catch (e) {
    console.log(e);
    return {
      error: "Failed to create the post.",
    };
  }
  return { data: postId };
};

export const createPost = fieldTypeChecker(CreatePost, handler);
