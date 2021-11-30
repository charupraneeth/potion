import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { StoreModel } from "../store";

import "../styles/TodosHeader.scss";
export const TodosHeader: React.FC = ({}) => {
  const todos = useStoreState((state: StoreModel) => state.todos);
  const addTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.addTodo
  );
  const reorderTodos = useStoreActions(
    (actions: Actions<StoreModel>) => actions.reorderTodos
  );

  function handleAddTodo() {
    const id = Date.now() + "";
    const startIndex = todos.size;
    addTodo({
      id,
      content: "",
    });
    reorderTodos({ startIndex, endIndex: 0 });
  }
  return (
    <div className="todos-header">
      <div className="todo-header-title">In progress</div>
      <div className="todo-header-add" onClick={handleAddTodo}>
        <svg viewBox="0 0 16 16" className="plus">
          <path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path>
        </svg>
      </div>
    </div>
  );
};
