import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import React from "react";
import { StoreModel } from "../store";

import "../styles/TodosHeader.scss";
import { makeid } from "../utils";

interface Props {
  category: {
    name: string;
    id: string;
  };
}
export const TodosHeader: React.FC<Props> = ({ category }) => {
  const todos = useStoreState(
    (state: StoreModel) => state.allTodos[category.id].todos
  );
  const addOrEditTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.addOrEditTodo
  );
  const reorderTodos = useStoreActions(
    (actions: Actions<StoreModel>) => actions.reorderTodos
  );

  const removeTodoGroup = useStoreActions(
    (actions: Actions<StoreModel>) => actions.removeTodoGroup
  );
  function handleRemoveGroup() {
    removeTodoGroup(category.id);
  }

  function handleAddTodo() {
    const id = makeid(10);
    const startIndex = todos.size;
    addOrEditTodo({
      id,
      content: "",
      categoryId: category.id,
    });
    reorderTodos({ startIndex, endIndex: 0, categoryId: category.id });
  }
  return (
    <div className="todos-header">
      <div
        className="todo-header-title editable"
        contentEditable={true}
        suppressContentEditableWarning={true}
      >
        {category.name}
      </div>
      <div className="action-btns">
        <div className="todo-header-remove" onClick={handleRemoveGroup}>
          <svg viewBox="0 0 30 30" className="trash-btn">
            <path d="M21,5c0-2.2-1.8-4-4-4h-4c-2.2,0-4,1.8-4,4H2v2h2v22h22V7h2V5H21z M13,3h4c1.104,0,2,0.897,2,2h-8C11,3.897,11.897,3,13,3zM24,27H6V7h18V27z M16,11h-2v12h2V11z M20,11h-2v12h2V11z M12,11h-2v12h2V11z"></path>
          </svg>
        </div>
        <div className="todo-header-add" onClick={handleAddTodo}>
          <svg viewBox="0 0 16 16" className="plus">
            <path d="M7.977 14.963c.407 0 .747-.324.747-.723V8.72h5.362c.399 0 .74-.34.74-.747a.746.746 0 00-.74-.738H8.724V1.706c0-.398-.34-.722-.747-.722a.732.732 0 00-.739.722v5.529h-5.37a.746.746 0 00-.74.738c0 .407.341.747.74.747h5.37v5.52c0 .399.332.723.739.723z"></path>
          </svg>
        </div>
      </div>
    </div>
  );
};
