import { auth } from "@/lib/firebase";

export const logout = async () => {
  await auth.signOut();
};
