import { auth } from "@/lib/firebase";

export const useAuth = () => {
  return auth.currentUser;
};
