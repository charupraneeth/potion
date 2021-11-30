import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useRef } from "react";
import { StoreModel } from "../store";
import "./InputModal.scss";

export const InputModal: React.FC = () => {
  const contentEl = useRef(null);
  const todo = useStoreState((state: StoreModel) => state.selectedTodo);

  useEffect(() => {
    if (!contentEl.current) return;
    // @ts-ignore
    contentEl.current.focus();
  }, []);
  const editTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.editTodo
  );

  const setSelectedTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setSelectedTodo
  );

  function handleOverlayClick(event: React.MouseEvent) {
    console.log("over lay click");
    // @ts-ignore
    if (event.target.classList[0] !== "input-modal-overlay") return;
    setSelectedTodo(null);
  }

  function handleInput(event: React.KeyboardEvent) {
    // @ts-ignore
    const updatedContent = event.target?.textContent;

    if (!todo) {
      alert("no todo ");
      return;
    }
    editTodo({
      todoContent: updatedContent,
      todoId: todo?.id,
    });
  }
  return (
    <div className="input-modal-overlay" onClick={handleOverlayClick}>
      <div className="input-modal">
        <div
          ref={contentEl}
          className="input-modal-content"
          contentEditable="true"
          onKeyUp={handleInput}
          suppressContentEditableWarning={true}
        >
          {todo?.content}
        </div>
      </div>
    </div>
  );
};
