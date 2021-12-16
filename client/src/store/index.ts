import { Action, action, createStore } from "easy-peasy";
import "easy-peasy/map-set-support";
import { TodoType } from "../@types";
import { makeid } from "../utils";

export type ReorderPayload = {
  startIndex: number;
  endIndex: number;
  groupId: string;
};

type MovePayload = {
  sourceIndex: number;
  destinationIndex: number;
  sourceId: string;
  destinationId: string;
};
type AddOrEditPayload = {
  todo: TodoType;
  groupId: string;
  todoIndex: number | null;
};

type DeletePayload = {
  todoId: string;
  groupId: string;
};

type SetSelectedTodoPayload = {
  todo: TodoType;
  groupId: string;
  todoIndex: number;
};

type SetMetaPayload = {
  type: "title" | "description";
  content: string;
};

type SetGroupNamePayload = {
  groupId: string;
  name: string;
};

type GroupType = {
  name: string;
  todos: TodoType[];
};
type MetaData = {
  title: string;
  description: string;
};

export interface StoreModel {
  metaData: MetaData;
  setMetaData: Action<StoreModel, SetMetaPayload>;
  selectedTodo: SetSelectedTodoPayload | null;
  reorderTodos: Action<StoreModel, ReorderPayload>;
  moveTodos: Action<StoreModel, MovePayload>;
  addOrEditTodo: Action<StoreModel, AddOrEditPayload>;
  setSelectedTodo: Action<StoreModel, SetSelectedTodoPayload | null>;
  deleteTodo: Action<StoreModel, DeletePayload>;
  allTodos: GroupType[];
  setGroupName: Action<StoreModel, SetGroupNamePayload>;
  // allTodos: {
  //   [categoryId: string]: {
  //     category: {
  //       id: string;
  //       name: string;
  //     };
  //     todos: Map<string, TodoType>;
  //   };
  // };
  addTodoGroup: Action<StoreModel>;
  removeTodoGroup: Action<StoreModel, string>;
}

const model: StoreModel = {
  selectedTodo: null,
  metaData: {
    description: "This is the description",
    title: "This is the title",
  },
  allTodos: [
    {
      name: "completed",
      todos: [
        { id: makeid(9), content: "first todo" },
        { id: makeid(9), content: "second todo" },
        { id: makeid(9), content: "third todo" },
        { id: makeid(9), content: "fourt todo" },
        { id: makeid(9), content: "fifth todo" },
      ],
    },
    {
      name: "in progres",
      todos: [
        { id: makeid(9), content: "first todo" },
        { id: makeid(9), content: "second todo" },
        { id: makeid(9), content: "third todo" },
        { id: makeid(9), content: "fourt todo" },
        { id: makeid(9), content: "fifth todo" },
      ],
    },
  ],

  reorderTodos: action((state, payload) => {
    const { endIndex, startIndex, groupId } = payload;
    const todos = state.allTodos[parseInt(groupId)].todos;
    const [removed] = todos.splice(startIndex, 1);
    todos.splice(endIndex, 0, removed);

    console.log("reordered", removed);

    state.allTodos[parseInt(groupId)].todos = todos;
  }),

  moveTodos: action((state, payload) => {
    const { destinationId, destinationIndex, sourceId, sourceIndex } = payload;
    const sourceEntries = state.allTodos[parseInt(sourceId)].todos;

    const destinationEntries = state.allTodos[parseInt(destinationId)].todos;

    const [removed] = sourceEntries.splice(sourceIndex, 1);

    destinationEntries.splice(destinationIndex, 0, removed);
    console.log("moved", removed);

    state.allTodos[parseInt(sourceId)].todos = sourceEntries;
    state.allTodos[parseInt(destinationId)].todos = destinationEntries;
  }),

  addOrEditTodo: action((state, payload) => {
    const { groupId, todo, todoIndex } = payload;
    console.log(todoIndex, todo.id);
    if (todoIndex == null) {
      state.allTodos[parseInt(groupId)].todos.push(todo);
    } else {
      state.allTodos[parseInt(groupId)].todos[todoIndex] = todo;
    }
  }),

  setSelectedTodo: action((state, payload) => {
    state.selectedTodo = payload;
  }),

  deleteTodo: action((state, payload) => {
    console.log("deleted");
    const { groupId, todoId } = payload;
    const todos = state.allTodos[parseInt(groupId)].todos;
    state.allTodos[parseInt(groupId)].todos = todos.filter(
      (todo) => todo.id != todoId
    );
  }),

  addTodoGroup: action((state) => {
    state.allTodos.push({ name: "", todos: [] });
  }),

  removeTodoGroup: action((state, groupId) => {
    console.log("removed group", groupId);
    delete state.allTodos[parseInt(groupId)];
  }),

  setMetaData: action((state, payload) => {
    console.log("meta changes", payload.content);

    if (payload.type === "title") {
      state.metaData.title = payload.content;
    } else if (payload.type === "description") {
      state.metaData.description = payload.content;
    }
  }),

  setGroupName: action((state, payload) => {
    const { groupId, name } = payload;
    console.log("group name set");

    state.allTodos[parseInt(groupId)].name = name;
  }),
};

const store = createStore(model, { name: "my-simple-store" });

export default store;
