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

export type ListWithCards = List & { cards: Card[] };
export type CardWithList = Card & { list: List };

export enum ACTION {
  CREATE,
  UPDATE,
  DELETE,
}

export enum ENTITY_TYPE {
  BOARD,
  LIST,
  CARD,
}

export type ActivityLog = {
  id: string;
  action: ACTION;
  entityId: string;
  entityType: ENTITY_TYPE;
  entityTitle: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
};
