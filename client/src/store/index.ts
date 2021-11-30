import { Action, action, createStore } from "easy-peasy";
import "easy-peasy/map-set-support";
import { TodoType } from "../@types";

export type ReorderPayload = {
  startIndex: number;
  endIndex: number;
};

export type EditPayload = {
  todoId: string;
  todoContent: string;
};

export interface StoreModel {
  selectedTodo: TodoType | null;
  todos: Map<string, TodoType>;
  reorderTodos: Action<StoreModel, ReorderPayload>;
  editTodo: Action<StoreModel, EditPayload>;
  setSelectedTodo: Action<StoreModel, TodoType | null>;
}

const model: StoreModel = {
  selectedTodo: null,
  todos: new Map(
    Object.entries({
      "1": { id: "1", content: "first todo" },
      "2": { id: "2", content: "second todo" },
      "3": { id: "3", content: "third todo" },
      "4": { id: "4", content: "fourt todo" },
      "5": { id: "5", content: "fifth todo" },
    })
  ),
  reorderTodos: action((state, payload) => {
    const { endIndex, startIndex } = payload;
    const entries = [...state.todos.entries()];

    const [removed] = entries.splice(startIndex, 1);
    entries.splice(endIndex, 0, removed);

    console.log("reordered");

    state.todos = new Map(entries);
  }),

  editTodo: action((state, payload) => {
    const { todoId, todoContent } = payload;
    state.todos.set(todoId, {
      id: todoId,
      content: todoContent,
    });
  }),
  setSelectedTodo: action((state, payload) => {
    state.selectedTodo = payload;
  }),
};

const store = createStore(model, { name: "my-simple-store" });

export default store;
