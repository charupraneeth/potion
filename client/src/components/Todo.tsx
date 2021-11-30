import { Actions, useStoreActions } from "easy-peasy";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TodoType } from "../@types";
import { StoreModel } from "../store";

interface Props {
  todo: TodoType;
  index: number;
}

export const Todo: React.FC<Props> = ({ todo, index }) => {
  const setSelectedTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setSelectedTodo
  );

  function handleModal() {
    setSelectedTodo(todo);
  }

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          className="todo"
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={handleModal}
        >
          {todo.content}
        </div>
      )}
    </Draggable>
  );
};
