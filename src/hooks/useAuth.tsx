import { auth } from "@/lib/firebase";
import { User } from "firebase/auth";
import { useState } from "react";

export const useAuth = () => {
  const [user, setUser] = useState(auth.currentUser);

  if (!user) {
    auth.onAuthStateChanged((data: User | null) => {
      setUser(data);
    });
  }
  return user;
};
