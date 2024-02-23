import { User } from "firebase/auth";

export type Board = {
  id: string;
  title: string;
  description: string;

  lists: List[];
};

export type List = {
  id: string;
  title: string;
  order: number;

  boardId: string;
  cards: Card[];

  createdAt: Date;
  updatedAt: Date;
};

export type Card = {
  id: string;
  title: string;
  description: string;
  link: string;
  order: number;

  listId: string;

  createdAt: Date;
  updatedAt: Date;
};

export type Comment = {
  id: string;
  cardId: string;
  message: string;
  user: User;
  createdAt: { seconds: number; nanoseconds: number };
  // updatedAt: Date;
};

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List };

export enum ACTION {
  CREATE = "CREATE",
  ADDED = "ADDED",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
  MOVED = "MOVED",
}

export enum ENTITY_TYPE {
  BOARD = "BOARD",
  LIST = "LIST",
  CARD = "CARD",
}

export type ActivityLog = {
  id: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  createdAt: { seconds: number; nanoseconds: number };
  updatedAt: { seconds: number; nanoseconds: number };
  memo?: string;
  user?: User;
};
