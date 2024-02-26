import { z } from "zod";
import { storage } from "@/lib/firebase";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";

// zod
const UploadImage = z.object({
  file: z.instanceof(File),
});

// types
type InputType = z.infer<typeof UploadImage>;
type ReturnType = ActionState<InputType, string>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { file } = data;
  let fileUrl;

  try {
    const filename = file.name + "_" + new Date().getTime();
    const storageRef = ref(storage, `posts/${filename}`);
    const upload = await uploadBytesResumable(storageRef, file);
    fileUrl = await getDownloadURL(upload.ref);
  } catch (e) {
    return {
      error: "Failed to upload image.",
    };
  }

  return { data: fileUrl };
};

export const uploadImage = fieldTypeChecker(UploadImage, handler);
