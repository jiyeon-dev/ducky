import { z } from "zod";
import { User, signInWithEmailAndPassword } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { ActionState, fieldTypeChecker } from "@/lib/fieldTypeChecker";
import { auth } from "@/lib/firebase";

// zod
const Login = z.object({
  email: z
    .string()
    .min(1, { message: "This field has to be filled." })
    .email("Invalid email address."),
  password: z.string(),
});

// types
type InputType = z.infer<typeof Login>;
type ReturnType = ActionState<InputType, User>;

// handler
const handler = async (data: InputType): Promise<ReturnType> => {
  const { email, password } = data;
  let user;

  try {
    const response = await signInWithEmailAndPassword(auth, email, password);
    user = response.user;
  } catch (e) {
    /**
     * message => Firebase: Error (auth/email-already-in-use).
     * code => auth/email-already-in-use
     * name => FirebaseError
     */
    if (e instanceof FirebaseError) {
      if (e.code === "auth/invalid-credential")
        return { error: "Email or password is incorrect." };
      else return { error: e.code };
    } else if (e instanceof Error) {
      return { error: e.message };
    } else {
      return { error: "Failed to login." };
    }
  }

  return { data: user };
};

export const login = fieldTypeChecker(Login, handler);
