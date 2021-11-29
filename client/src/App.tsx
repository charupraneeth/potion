import Description from "./components/Description";
import Title from "./components/Title";
import TodosContainer from "./components/TodosContainer";
import "./App.scss";
import { DragDropContext, DropResult } from "react-beautiful-dnd";
import { useState } from "react";
import { TodoType } from "./@types";

function App() {
  const intitialTodos: Map<string, TodoType> = new Map(
    Object.entries({
      "1": { id: "1", content: "first todo" },
      "2": { id: "2", content: "second todo" },
      "3": { id: "3", content: "third todo" },
      "4": { id: "4", content: "fourt todo" },
      "5": { id: "5", content: "fifth todo" },
    })
  );

  const [todos, setTodos] = useState(intitialTodos);

  const reorder = (
    list: Map<string, TodoType>,
    startIndex: number,
    endIndex: number
  ) => {
    const entries = [...list.entries()];

    const [removed] = entries.splice(startIndex, 1);
    entries.splice(endIndex, 0, removed);

    return entries;
  };

  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const newEntries = reorder(
      todos,
      result.source.index,
      result.destination.index
    );

    setTodos(new Map(newEntries));
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <main className="main">
        <Title />
        <Description />
        <TodosContainer todos={todos} />
      </main>
    </DragDropContext>
  );
}

export default App;
