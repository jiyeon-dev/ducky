import { create } from "zustand";

type CardModalStore = {
  id?: string;
  listId?: string;
  isOpen: boolean;
  onOpen: (id: string, listId: string) => void;
  onClose: () => void;
};

export const useCardModal = create<CardModalStore>((set) => ({
  id: undefined,
  listId: undefined,
  isOpen: false,
  onOpen: (id: string, listId: string) => set({ isOpen: true, id, listId }),
  onClose: () => set({ isOpen: false, id: undefined, listId: undefined }),
}));
