export type TodoType = {
  id: string;
  content: string;
};

export type ReorderPayload = {
  startIndex: number;
  endIndex: number;
  groupId: string;
};

export type MovePayload = {
  sourceIndex: number;
  destinationIndex: number;
  sourceId: string;
  destinationId: string;
};
export type AddOrEditPayload = {
  todo: TodoType;
  groupId: string;
  todoIndex: number | null;
};

export type DeletePayload = {
  todoId: string;
  groupId: string;
};

export type AddGroupPayload = {
  groupId: string;
};

export type SetSelectedTodoPayload = {
  todo: TodoType;
  groupId: string;
  todoIndex: number;
};

export type SetMetaPayload = {
  type: "title" | "description";
  content: string;
};

export type RemoveGroupPayload = {
  groupId: string;
};

export type SetGroupNamePayload = {
  groupId: string;
  name: string;
};
