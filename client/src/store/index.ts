import { Action, action, createStore, persist, thunk, Thunk } from "easy-peasy";
import "easy-peasy/map-set-support";
import { GroupsCollection, TodosCollection, TodoType } from "../@types";
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
  pos: "start" | "end";
};

type DeletePayload = {
  todoId: string;
  groupId: string;
};

type SetSelectedTodoPayload = {
  todo: TodoType;
  groupId: string;
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

type AddGroupPayload = {
  groupId: string;
};

type MainDataPayload = {
  groupsOrder: string[];
  groups: GroupsCollection;
  todos: TodosCollection;
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
      payload: AddGroupPayload;
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
  groupsOrder: string[];
  groups: GroupsCollection;
  todos: TodosCollection;
  allTodos: GroupType[];
  setGroupName: Action<StoreModel, SetGroupNamePayload>;
  addTodoGroup: Action<StoreModel, AddGroupPayload>;
  removeTodoGroup: Action<StoreModel, RemoveGroupPayload>;
  setMainData: Action<StoreModel, MainDataPayload>;
  updateData: Thunk<StoreModel, ThunkPayload>;
}

const model: StoreModel = {
  ws: null,
  selectedTodo: null,
  metaData: {
    description: "",
    title: "",
  },
  todos: {},
  groups: {},
  groupsOrder: [],
  allTodos: [],

  reorderTodos: action((state, payload) => {
    const { endIndex, startIndex, groupId } = payload;
    const todos = state.groups[groupId].todos;
    const [removed] = todos.splice(startIndex, 1);
    todos.splice(endIndex, 0, removed);

    console.log("reordered", removed);

    state.groups[groupId].todos = todos;
  }),

  moveTodos: action((state, payload) => {
    const { destinationId, destinationIndex, sourceId, sourceIndex } = payload;
    const sourceEntries = state.groups[sourceId].todos;

    const destinationEntries = state.groups[destinationId].todos;

    const [removed] = sourceEntries.splice(sourceIndex, 1);

    destinationEntries.splice(destinationIndex, 0, removed);
    console.log("moved", removed);

    state.groups[sourceId].todos = sourceEntries;
    state.groups[destinationId].todos = destinationEntries;
  }),

  addOrEditTodo: action((state, payload) => {
    const { groupId, todo, pos = null } = payload;
    console.log("todo", todo.id);

    if (pos == "end") {
      state.groups[groupId].todos.push(todo.id);
    } else if (pos === "start") {
      state.groups[groupId].todos.unshift(todo.id);
    }
    // add all todos with pos: end/start/null to the collection
    state.todos[todo.id] = todo;
  }),

  setSelectedTodo: action((state, payload) => {
    state.selectedTodo = payload;
  }),

  deleteTodo: action((state, payload) => {
    console.log("deleted");
    const { groupId, todoId } = payload;
    const todos = state.groups[groupId].todos;
    state.groups[groupId].todos = todos.filter((id) => id != todoId);
    delete state.todos[todoId];
  }),

  addTodoGroup: action((state, payload) => {
    const { groupId } = payload;
    state.groupsOrder.push(groupId);
    state.groups[groupId] = { id: groupId, name: "", todos: [] };
  }),

  removeTodoGroup: action((state, payload) => {
    const { groupId } = payload;
    console.log("removed group", groupId);

    state.groupsOrder = state.groupsOrder.filter((id) => id !== groupId);
    delete state.groups[groupId];
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

  setMainData: action((state, payload) => {
    const { groups, groupsOrder, todos } = payload;
    state.groups = groups;
    state.groupsOrder = groupsOrder;
    state.todos = todos;
  }),

  setWs: action((state, payload) => {
    state.ws = payload;
  }),

  updateData: thunk(async (actions, payload, helpers) => {
    const { type, updateLocally = false } = payload;

    const { ws } = helpers.getState();
    if (!updateLocally && type !== "setSelectedTodo") {
      // send updates to server
      ws?.send(JSON.stringify({ type, payload: payload.payload }));
    } else {
      // update locally
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
          actions["addTodoGroup"](payload.payload);
          break;
      }
    }
  }),
};

const store = createStore(model, {
  name: "my-simple-store",
});

export default store;
