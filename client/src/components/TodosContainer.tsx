import { Action, Actions, useStoreActions, useStoreState } from "easy-peasy";
import { Droppable } from "react-beautiful-dnd";
import { StoreModel } from "../store";
import { TodosHeader } from "./TodosHeader";
import Todo from "./Todo";

const TodosContainer = () => {
  const updaterThunk = useStoreActions(
    (actions: Actions<StoreModel>) => actions.updateData
  );
  const allTodos = useStoreState((state: StoreModel) => state.allTodos);
  const groupsOrder = useStoreState((state: StoreModel) => state.groupsOrder);
  const groups = useStoreState((state: StoreModel) => state.groups);
  const todos = useStoreState((state: StoreModel) => state.todos);

  function handleNewGroup() {
    updaterThunk({ type: "addTodoGroup" });
  }

  return (
    <div className="all-todos-container">
      {groupsOrder.map((groupId, index) => (
        <Droppable droppableId={groupId} key={index}>
          {(provided) => {
            const group = groups[groupId];
            const { name, todos: todosOrder } = group;
            return (
              <>
                <div
                  className="todos-container"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  <TodosHeader groupName={name} groupId={groupId} />
                  <div className="todos-wrap">
                    {todosOrder.map((todoId, todoIndex) => {
                      const todo = todos[todoId];
                      return (
                        <Todo
                          key={todo.id}
                          todo={todo}
                          index={todoIndex}
                          groupId={groupId}
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
