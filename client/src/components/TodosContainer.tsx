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
      {allTodos.map((group, index) => (
        <Droppable droppableId={String(index)} key={index}>
          {(provided) => {
            console.log("id", index);

            const { name, todos } = group;
            return (
              <>
                <div
                  className="todos-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TodosHeader groupName={name} groupId={index} />
                  <div className="todos-wrap">
                    {todos.map((todo, todoIndex) => {
                      return (
                        <Todo
                          key={todo.id}
                          todo={todo}
                          index={todoIndex}
                          groupId={index}
                        />
                      );
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
