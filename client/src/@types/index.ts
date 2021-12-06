export type TodoType = {
  id: string;
  content: string;
  categoryId: string;
};

export interface TodoCollection {
  [todoId: string]: TodoType;
}
