import { Actions, useStoreActions } from "easy-peasy";
import React from "react";
import { Draggable } from "react-beautiful-dnd";
import { TodoType } from "../@types";
import { StoreModel } from "../store";
import { DeleteTodo } from "./DeleteTodo";

interface Props {
  todo: TodoType;
  index: number;
  groupId: number;
}

const Todo: React.FC<Props> = ({ todo, index, groupId }) => {
  const setSelectedTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setSelectedTodo
  );

  function handleModal() {
    setSelectedTodo({ todo, groupId: String(groupId), todoIndex: index });
  }

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided) => (
        <div
          className={`todo ${todo.content.length ? "" : "is-empty"}`}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          onClick={handleModal}
        >
          {todo.content}
          <DeleteTodo todoId={todo.id} groupId={String(groupId)} />
        </div>
      )}
    </Draggable>
  );
};

export default Todo;
