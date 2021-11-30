import Title from "../components/Title";
import TodosContainer from "../components/TodosContainer";
import Description from "../components/Description";

import { StoreModel } from "../store";
import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { InputModal } from "./InputModal";

const Main = () => {
  const reorderTodos = useStoreActions(
    (actions: Actions<StoreModel>) => actions.reorderTodos
  );

  const selectedTodo = useStoreState((state: StoreModel) => state.selectedTodo);

  function handleDragEnd(result: DropResult) {
    console.log("drag ended");

    if (!result.destination) return;
    reorderTodos({
      startIndex: result.source.index,
      endIndex: result.destination.index,
    });
  }
  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="main">
        <Title />
        <Description />
        <TodosContainer />
      </main>
      {selectedTodo && selectedTodo.id && <InputModal />}
    </DragDropContext>
  );
};

export default Main;
