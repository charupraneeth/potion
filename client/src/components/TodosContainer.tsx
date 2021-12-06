import { Action, Actions, useStoreActions, useStoreState } from "easy-peasy";
import { Droppable } from "react-beautiful-dnd";
import { StoreModel } from "../store";
import { TodosHeader } from "./TodosHeader";
import Todo from "./Todo";

const TodosContainer = () => {
  const allTodos = useStoreState((state: StoreModel) => state.allTodos);

  const addTodoGroup = useStoreActions(
    (actions: Actions<StoreModel>) => actions.addTodoGroup
  );

  function handleNewGroup() {
    addTodoGroup();
  }
  return (
    <div className="all-todos-container">
      {Object.keys(allTodos).map((categoryId) => (
        <Droppable droppableId={categoryId} key={categoryId}>
          {(provided) => {
            console.log("id", categoryId);

            const { category, todos } = allTodos[categoryId];
            return (
              <>
                <div
                  className="todos-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TodosHeader category={category} />
                  <div className="todos-wrap">
                    {[...todos.entries()].map((entry, index) => {
                      const todo = entry[1];
                      return <Todo key={todo.id} todo={todo} index={index} />;
                    })}
                  </div>
                  {provided.placeholder}
                </div>
              </>
            );
          }}
        </Droppable>
      ))}
      <div className="new-group">
        <button className="new-group-btn" onClick={handleNewGroup}>
          New
        </button>
      </div>
    </div>
  );
};

export default TodosContainer;
