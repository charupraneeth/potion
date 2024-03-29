import { WebSocketServer, WebSocket } from "ws";
import { createServer, IncomingMessage, ServerResponse } from "http";
import { nanoid } from "nanoid";
import { config } from "dotenv";

import { parse } from "url";

import {
  AddGroupPayload,
  AddOrEditPayload,
  DeletePayload,
  MovePayload,
  RemoveGroupPayload,
  ReorderPayload,
  SetGroupNamePayload,
  SetMetaPayload,
  TodoType,
} from "./@types";

config();
const port = process.env.PORT || 1337;

function handleRequest(req: IncomingMessage, res: ServerResponse) {
  if (req.method == "GET") {
    if (!req.url) return;
    const { pathname } = parse(req.url);
    if (pathname === "/alltodos") {
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      const allTodos = groupsOrder.map((groupId) => {
        const group = groups[groupId as keyof typeof groups];
        const groupClone = { ...group };
        // @ts-ignore
        groupClone.todos = groupClone.todos.map((todoId) => {
          return todos[todoId as keyof typeof todos];
        });

        return groupClone;
      });
      return res.end(JSON.stringify(allTodos));
    }
    if (pathname === "/metadata") {
      res.setHeader("Content-Type", "application/json;charset=utf-8");
      return res.end(JSON.stringify(metaData));
    }
  }
}

const server = createServer((req, res) => {
  return handleRequest(req, res);
});

const wss = new WebSocketServer({ server });

type GroupId = keyof typeof groups;
type TodoId = keyof typeof todos;

const metaData = {
  description: "This is the description",
  title: "This is the title",
};

let groups = {
  QBx4CSb7cB5f0sgpRSDT_: {
    id: "QBx4CSb7cB5f0sgpRSDT_",
    name: "completed",
    todos: [
      "QBx4CSb7c8OD0sgpRSDT_",
      "k3vuaSR36t_e46KPfgkxC",
      "T2pb6shvPaCgJDkaowwEQ",
      "UdkGGwm0_lQGbQ5W2M3tr",
      "ZEZ235mIOAb_ejhslSb3j",
    ],
  },
  SwnoEqMHeRa34J0XBieTLs: {
    id: "SwnoEqMHeRa34J0XBieTLs",
    name: "in progres",
    todos: [
      "SwnoEqMHElzvJ0XBieTLs",
      "bnaCbDP-stWEImXRSugEp",
      "-56Ocs46d8nvGWcuoyEar",
      "b8jr-Z8WQmove7xQ1MJ_j",
      "qdV5bG2OWM5Q-t95MuJkO",
    ],
  },
};

let groupsOrder = ["QBx4CSb7cB5f0sgpRSDT_", "SwnoEqMHeRa34J0XBieTLs"];

let todos = {
  QBx4CSb7c8OD0sgpRSDT_: { id: "QBx4CSb7c8OD0sgpRSDT_", content: "first todo" },
  k3vuaSR36t_e46KPfgkxC: {
    id: "k3vuaSR36t_e46KPfgkxC",
    content: "second todo",
  },
  T2pb6shvPaCgJDkaowwEQ: {
    id: "T2pb6shvPaCgJDkaowwEQ",
    content: "third todo",
  },
  UdkGGwm0_lQGbQ5W2M3tr: {
    id: "UdkGGwm0_lQGbQ5W2M3tr",
    content: "fourt todo",
  },
  ZEZ235mIOAb_ejhslSb3j: { id: "ZEZ235mIOAb_ejhslSb3j", content: "fifth todo" },
  SwnoEqMHElzvJ0XBieTLs: { id: "SwnoEqMHElzvJ0XBieTLs", content: "sixth todo" },
  "bnaCbDP-stWEImXRSugEp": {
    id: "bnaCbDP-stWEImXRSugEp",
    content: "seventh todo",
  },
  "-56Ocs46d8nvGWcuoyEar": {
    id: "-56Ocs46d8nvGWcuoyEar",
    content: "eight todo",
  },
  "b8jr-Z8WQmove7xQ1MJ_j": {
    id: "b8jr-Z8WQmove7xQ1MJ_j",
    content: "nineth todo",
  },
  "qdV5bG2OWM5Q-t95MuJkO": {
    id: "qdV5bG2OWM5Q-t95MuJkO",
    content: "tenth todo",
  },
};

let allTodos = [
  {
    name: "completed",
    todos: [
      { id: "QBx4CSb7c8OD0sgpRSDT_", content: "first todo" },
      { id: "k3vuaSR36t_e46KPfgkxC", content: "second todo" },
      { id: "2Tpb6shvPaCgJDkaowwEQ", content: "third todo" },
      { id: "-UkGGwm0_lQGbQ5W2M3tr", content: "fourt todo" },
      { id: "ZEZ235mIOAb_ejhslSb3j", content: "fifth todo" },
    ],
  },
  {
    name: "in progres",
    todos: [
      { id: "SwnoEqMHElzvJ0XBieTLs", content: "first todo" },
      { id: "bnaCbDP-stWEImXRSugEp", content: "second todo" },
      { id: "-56Ocs46d8nvGWcuoyEar", content: "third todo" },
      { id: "b8jr-Z8WQmove7xQ1MJ_j", content: "fourt todo" },
      { id: "qdV5bG2OWM5Q-t95MuJkO", content: "fifth todo" },
    ],
  },
];

function reorderTodos(payload: ReorderPayload) {
  const { endIndex, startIndex, groupId } = payload;
  const todos = groups[groupId as GroupId].todos;
  const [removed] = todos.splice(startIndex, 1);
  todos.splice(endIndex, 0, removed);

  console.log("reordered", removed);

  groups[groupId as GroupId].todos = todos;
}

function moveTodos(payload: MovePayload) {
  const { destinationId, destinationIndex, sourceId, sourceIndex } = payload;
  const sourceEntries = groups[sourceId as GroupId].todos;

  const destinationEntries = groups[destinationId as GroupId].todos;

  const [removed] = sourceEntries.splice(sourceIndex, 1);

  destinationEntries.splice(destinationIndex, 0, removed);
  console.log("moved", removed);

  groups[sourceId as GroupId].todos = sourceEntries;
  groups[destinationId as GroupId].todos = destinationEntries;
}

function addOrEditTodo(payload: AddOrEditPayload) {
  const { groupId, todo, pos = null } = payload;
  console.log("edit todo", todo, pos);
  if (todo.id === "") {
    const id = nanoid();
    payload.todo.id = id;
    if (pos === "start") {
      groups[groupId as GroupId].todos.push(id);
    } else if (pos === "end") {
      groups[groupId as GroupId].todos.unshift(id);
    }
    todos[id as TodoId] = { content: "", id };
  } else {
    todos[todo.id as TodoId] = todo;
  }
}

function deleteTodo(payload: DeletePayload) {
  const { groupId, todoId } = payload;
  console.log("deleted", groupId, todoId);
  const { todos: todosClone } = groups[groupId as GroupId];
  if (!todos) return;

  groups[groupId as GroupId].todos = todosClone.filter((id) => id != todoId);
  delete todos[todoId as TodoId];
}

function addTodoGroup(payload: AddGroupPayload) {
  console.log("adding todo group");
  const id = nanoid();
  groups[id as GroupId] = { id, name: "", todos: [] };
  groupsOrder.push(id);
  payload.groupId = id;
  // allTodos.push({ name: "", todos: [] });
}

function removeTodoGroup(payload: RemoveGroupPayload) {
  const { groupId = null } = payload;
  console.log("removed group", groupId);
  if (groupId === null) return;
  groupsOrder = groupsOrder.filter((id) => id != groupId);
  delete groups[groupId as GroupId];
}

function setMetaData(payload: SetMetaPayload) {
  console.log("meta changes", payload.content);

  if (payload.type === "title") {
    metaData.title = payload.content;
  } else if (payload.type === "description") {
    metaData.description = payload.content;
  }
}

function setGroupName(payload: SetGroupNamePayload) {
  const { groupId, name } = payload;
  console.log("group name set", name);
  groups[groupId as GroupId].name = name;
}

wss.on("connection", function connection(ws) {
  console.log("connected ");

  ws.on("message", function message(data) {
    // @ts-ignore

    console.log("received: ", JSON.parse(data.toString()));
    const { type = null, payload = null } = JSON.parse(data.toString());
    if (!type) return;
    if (!payload) return;
    switch (type) {
      case "addOrEditTodo":
        addOrEditTodo(payload);
        break;
      case "deleteTodo":
        deleteTodo(payload);
        break;
      case "reorderTodos":
        reorderTodos(payload);
        break;
      case "moveTodos":
        moveTodos(payload);
        break;
      case "setGroupName":
        setGroupName(payload);
        break;
      case "setMetaData":
        setMetaData(payload);
        break;
      case "removeTodoGroup":
        removeTodoGroup(payload);
        break;
      case "addTodoGroup":
        addTodoGroup(payload);
        break;
    }
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        if (type === "moveTodos" || type === "reorderTodos") {
          if (client == ws) return;
        }
        client.send(JSON.stringify({ type, payload }));
      }
    });
  });

  ws.send(
    JSON.stringify({
      type: "initialData",
      payload: {
        groupsOrder,
        groups,
        todos,
        metaData,
      },
    })
  );
});

server.listen(port, () => console.log(`listening at port : ${port}`));
