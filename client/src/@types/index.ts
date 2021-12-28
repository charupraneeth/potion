export type TodoType = {
  id: string;
  content: string;
};

export interface GroupsCollection {
  [groupId: string]: {
    id: string;
    name: string;
    todos: string[];
  };
}

export interface TodosCollection {
  [todoId: string]: TodoType;
}
