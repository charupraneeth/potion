import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useRef } from "react";
import { StoreModel } from "../store";
import "../styles/InputModal.scss";
import { DeleteTodo } from "./DeleteTodo";

export const InputModal: React.FC = () => {
  const contentEl = useRef(null);
  const todo = useStoreState((state: StoreModel) => state.selectedTodo);

  useEffect(() => {
    if (!contentEl.current) return;
    const el = contentEl.current;
    const selection = window.getSelection();
    const range = document.createRange();
    if (!selection) return;
    selection.removeAllRanges();
    range.selectNodeContents(el);
    range.collapse(false);
    selection.addRange(range);
    // @ts-ignore
    el.focus();
  }, []);
  const addOrEditTodo = useStoreActions(
    (actions: Actions<StoreModel>) => actions.addOrEditTodo
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
    addOrEditTodo({
      content: updatedContent,
      id: todo?.id,
    });
  }
  return (
    <div className="input-modal-overlay" onClick={handleOverlayClick}>
      <div className="input-modal">
        {todo?.id && <DeleteTodo todoId={todo.id} />}
        {todo?.id && (
          <div
            ref={contentEl}
            className="input-modal-content"
            contentEditable="true"
            onKeyUp={handleInput}
            suppressContentEditableWarning={true}
          >
            {todo?.content}
          </div>
        )}
      </div>
    </div>
  );
};
