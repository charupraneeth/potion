import { Draggable, Droppable } from "react-beautiful-dnd";
import { TodoType } from "../@types";

interface Props {
  todos: Map<string, TodoType>;
}

const TodosContainer: React.FC<Props> = ({ todos }) => {
  return (
    <Droppable droppableId="droppable">
      {(provided) => (
        <div
          className="todos-container"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {[...todos.entries()].map((entry, index) => {
            const { content, id } = entry[1];
            return (
              <Draggable draggableId={id} key={id} index={index}>
                {(provided) => (
                  <div
                    className="todo"
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    ref={provided.innerRef}
                  >
                    {content}
                  </div>
                )}
              </Draggable>
            );
          })}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  );
};

export default TodosContainer;
