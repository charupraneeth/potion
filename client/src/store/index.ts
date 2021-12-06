import { Action, action, createStore } from "easy-peasy";
import "easy-peasy/map-set-support";
import { TodoType } from "../@types";
import { makeid } from "../utils";

export type ReorderPayload = {
  startIndex: number;
  endIndex: number;
  categoryId: string;
};

type AddOrEditPayload = {
  todo: TodoType;
  categoryId: string;
};

type DeletePayload = {
  todoId: string;
  categoryId: string;
};

export interface StoreModel {
  selectedTodo: TodoType | null;
  reorderTodos: Action<StoreModel, ReorderPayload>;
  addOrEditTodo: Action<StoreModel, TodoType>;
  setSelectedTodo: Action<StoreModel, TodoType | null>;
  deleteTodo: Action<StoreModel, TodoType>;
  allTodos: {
    [categoryId: string]: {
      category: {
        id: string;
        name: string;
      };
      todos: Map<string, TodoType>;
    };
  };
}

const model: StoreModel = {
  selectedTodo: null,
  allTodos: {
    "12345abcd": {
      category: {
        id: "12345abcd",
        name: "completed",
      },
      todos: new Map(
        Object.entries({
          "6": { id: "6", content: "first todo", categoryId: "12345abcd" },
          "7": { id: "7", content: "second todo", categoryId: "12345abcd" },
          "8": { id: "8", content: "third todo", categoryId: "12345abcd" },
          "9": { id: "9", content: "fourt todo", categoryId: "12345abcd" },
          "10": { id: "10", content: "fifth todo", categoryId: "12345abcd" },
        })
      ),
    },
    "67890abcd": {
      category: {
        id: "67890abcd",
        name: "in progress",
      },
      todos: new Map(
        Object.entries({
          "1": { id: "1", content: "first todo", categoryId: "67890abcd" },
          "2": { id: "2", content: "second todo", categoryId: "67890abcd" },
          "3": { id: "3", content: "third todo", categoryId: "67890abcd" },
          "4": { id: "4", content: "fourt todo", categoryId: "67890abcd" },
          "5": { id: "5", content: "fifth todo", categoryId: "67890abcd" },
        })
      ),
    },
  },
  reorderTodos: action((state, payload) => {
    const { endIndex, startIndex, categoryId } = payload;
    const entries = [...state.allTodos[categoryId].todos.entries()];

    const [removed] = entries.splice(startIndex, 1);
    entries.splice(endIndex, 0, removed);

    console.log("reordered");

    state.allTodos[categoryId].todos = new Map(entries);
  }),

  addOrEditTodo: action((state, payload) => {
    const { categoryId } = payload;
    state.allTodos[categoryId].todos.set(payload.id, payload);
  }),

  setSelectedTodo: action((state, payload) => {
    state.selectedTodo = payload;
  }),

  deleteTodo: action((state, payload) => {
    console.log("deleted");
    const { categoryId, id } = payload;
    state.allTodos[categoryId].todos.delete(id);
  }),
};

const store = createStore(model, { name: "my-simple-store" });

export default store;
