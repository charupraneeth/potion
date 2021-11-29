export type TodoType = {
  id: string;
  content: string;
};

export interface TodoCollection {
  [todoId: string]: TodoType;
}
