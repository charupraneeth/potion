import Title from "../components/Title";
import TodosContainer from "../components/TodosContainer";
import Description from "../components/Description";

import { StoreModel } from "../store";
import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { InputModal } from "./InputModal";
import { useEffect, useState } from "react";

const Main = () => {
  const [connected, setConnected] = useState(false);

  const setAllTodos = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setAllTodos
  );
  const setMetaData = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setMetaData
  );
  const setWs = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setWs
  );
  useEffect(() => {
    const socket = new WebSocket("ws://192.168.1.4:1337");
    socket.onopen = () => {
      console.log("socket connected");
      setConnected(true);
      setWs(socket);
    };
    socket.onmessage = (msg) => {
      console.log("msg recieved", msg.data);
      const { type, payload } = JSON.parse(msg.data);
      if (type === "initialData") {
        const { allTodos, metaData } = payload;
        if (metaData?.title) {
          setMetaData({ type: "title", content: metaData.title });
        }
        if (metaData?.description) {
          setMetaData({ type: "description", content: metaData.description });
        }

        setAllTodos(allTodos);
        setMetaData(metaData);
      }
    };
  }, []);

  const updaterThunk = useStoreActions(
    (actions: Actions<StoreModel>) => actions.updateData
  );

  const selectedTodo = useStoreState((state: StoreModel) => state.selectedTodo);

  function handleDragEnd(result: DropResult) {
    console.log("drag ended");

    if (!result.destination) return;
    if (result.source.droppableId === result.destination.droppableId) {
      if (result.source.index === result.destination.index) return;
      return updaterThunk({
        type: "reorderTodos",
        payload: {
          startIndex: result.source.index,
          endIndex: result.destination.index,
          groupId: result.destination.droppableId,
        },
      });
    }
    updaterThunk({
      type: "moveTodos",
      payload: {
        sourceIndex: result.source.index,
        destinationIndex: result.destination.index,
        destinationId: result.destination.droppableId,
        sourceId: result.source.droppableId,
      },
    });
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      {connected ? (
        <main className="main">
          <Title />
          <Description />
          <TodosContainer />
        </main>
      ) : (
        <div>loading...</div>
      )}
      {selectedTodo && selectedTodo.todo.id && <InputModal />}
    </DragDropContext>
  );
};

export default Main;
