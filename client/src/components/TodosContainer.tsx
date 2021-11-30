import { useStoreState } from "easy-peasy";
import { Droppable } from "react-beautiful-dnd";
import { StoreModel } from "../store";
import { Todo } from "./Todo";

const TodosContainer: React.FC = () => {
  const todos = useStoreState((state: StoreModel) => state.todos);

  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <>
          <div
            className="todos-container"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {[...todos.entries()].map((entry, index) => {
              const todo = entry[1];
              return <Todo key={todo.id} todo={todo} index={index} />;
            })}
            {provided.placeholder}
          </div>
        </>
      )}
    </Droppable>
  );
};

export default TodosContainer;
