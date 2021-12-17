import Title from "../components/Title";
import TodosContainer from "../components/TodosContainer";
import Description from "../components/Description";

import { StoreModel } from "../store";
import {
  Actions,
  useStoreActions,
  useStoreRehydrated,
  useStoreState,
} from "easy-peasy";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { InputModal } from "./InputModal";

const Main = () => {
  const isRehyDrated = useStoreRehydrated();

  const metaData = localStorage.getItem("metaData");
  const allTodos = localStorage.getItem("allTodos");
  const setAllTodos = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setAllTodos
  );
  const setMetaData = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setMetaData
  );
  if (metaData) {
    setMetaData(JSON.parse(metaData));
  }
  if (allTodos) {
    setAllTodos(JSON.parse(allTodos));
  }

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
      {isRehyDrated ? (
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
