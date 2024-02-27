import { auth } from "@/lib/firebase";
import { toast } from "sonner";

export const logout = async (showToast?: boolean) => {
  await auth.signOut();
  if (showToast) toast.info(`Bye Bye 👋`, { id: "logout" });
};
