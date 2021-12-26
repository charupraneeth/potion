import { Action, action, createStore, persist, thunk, Thunk } from "easy-peasy";
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

type RemoveGroupPayload = {
  groupId: string;
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
type ThunkPayload =
  | {
      type: "setMetaData";
      payload: SetMetaPayload;
      updateLocally?: boolean;
    }
  | {
      type: "setSelectedTodo";
      payload: SetSelectedTodoPayload | null;
      updateLocally?: boolean;
    }
  | {
      type: "reorderTodos";
      payload: ReorderPayload;
      updateLocally?: boolean;
    }
  | {
      type: "moveTodos";
      payload: MovePayload;
      updateLocally?: boolean;
    }
  | {
      type: "addOrEditTodo";
      payload: AddOrEditPayload;
      updateLocally?: boolean;
    }
  | {
      type: "deleteTodo";
      payload: DeletePayload;
      updateLocally?: boolean;
    }
  | {
      type: "setGroupName";
      payload: SetGroupNamePayload;
      updateLocally?: boolean;
    }
  | {
      type: "removeTodoGroup";
      payload: RemoveGroupPayload;
      updateLocally?: boolean;
    }
  | {
      type: "addTodoGroup";
      updateLocally?: boolean;
    };

export interface StoreModel {
  ws: WebSocket | null;
  setWs: Action<StoreModel, WebSocket>;
  metaData: MetaData;
  setMetaData: Action<StoreModel, SetMetaPayload>;
  selectedTodo: SetSelectedTodoPayload | null;
  setSelectedTodo: Action<StoreModel, SetSelectedTodoPayload | null>;
  reorderTodos: Action<StoreModel, ReorderPayload>;
  moveTodos: Action<StoreModel, MovePayload>;
  addOrEditTodo: Action<StoreModel, AddOrEditPayload>;
  deleteTodo: Action<StoreModel, DeletePayload>;
  allTodos: GroupType[];
  setGroupName: Action<StoreModel, SetGroupNamePayload>;
  addTodoGroup: Action<StoreModel>;
  removeTodoGroup: Action<StoreModel, RemoveGroupPayload>;
  setAllTodos: Action<StoreModel, GroupType[]>;
  updateData: Thunk<StoreModel, ThunkPayload>;
}

const model: StoreModel = {
  ws: null,
  selectedTodo: null,
  metaData: {
    description: "",
    title: "",
  },

  allTodos: [],

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
      // no todo index => add todo
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

  removeTodoGroup: action((state, payload) => {
    const { groupId } = payload;
    console.log("removed group", groupId);
    state.allTodos = state.allTodos.filter(
      (_, index) => index != parseInt(groupId)
    );
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

  setAllTodos: action((state, payload) => {
    state.allTodos = payload;
  }),

  setWs: action((state, payload) => {
    state.ws = payload;
  }),

  updateData: thunk(async (actions, payload, helpers) => {
    const { type, updateLocally = false } = payload;

    const { ws } = helpers.getState();
    if (!updateLocally && type !== "setSelectedTodo") {
      if (type == "addTodoGroup") {
        ws?.send(JSON.stringify({ type }));
      } else {
        ws?.send(JSON.stringify({ type, payload: payload.payload }));
      }
    } else {
      switch (type) {
        case "addOrEditTodo":
          if (payload.payload.todo.id) actions.addOrEditTodo(payload.payload);
          break;
        case "deleteTodo":
          actions["deleteTodo"](payload.payload);
          break;
        case "reorderTodos":
          actions["reorderTodos"](payload.payload);
          break;
        case "moveTodos":
          actions["moveTodos"](payload.payload);
          break;
        case "setGroupName":
          actions["setGroupName"](payload.payload);
          break;
        case "setMetaData":
          actions["setMetaData"](payload.payload);
          break;
        case "setSelectedTodo":
          actions["setSelectedTodo"](payload.payload);
          break;
        case "removeTodoGroup":
          actions["removeTodoGroup"](payload.payload);
          break;
        case "addTodoGroup":
          actions["addTodoGroup"]();
          break;
      }
    }
  }),
};

const store = createStore(model, {
  name: "my-simple-store",
});

export default store;
