import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import React, { useEffect, useRef } from "react";
import { StoreModel } from "../store";
import "../styles/InputModal.scss";
import { DeleteTodo } from "./DeleteTodo";

export const InputModal: React.FC = () => {
  const contentEl = useRef(null);
  const selectedTodo = useStoreState((state: StoreModel) => state.selectedTodo);
  let debounceTimer: number;
  const debounceTimeout = 1000;

  const updaterThunk = useStoreActions(
    (actions: Actions<StoreModel>) => actions.updateData
  );
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

  function handleOverlayClick(event: React.MouseEvent) {
    console.log("over lay click");
    // @ts-ignore
    if (event.target.classList[0] !== "input-modal-overlay") return;

    updaterThunk({
      type: "setSelectedTodo",
      payload: null,
      updateLocally: true,
    });
  }

  // TODO : implement throttling
  function handleInput(event: React.KeyboardEvent) {
    // @ts-ignore
    const updatedContent = event.target?.textContent;

    if (!selectedTodo || !selectedTodo.todo) {
      alert("no todo ");
      return;
    }
    const updated = selectedTodo;
    updated.todo.content = updatedContent;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      updaterThunk({ type: "addOrEditTodo", payload: updated });
    }, debounceTimeout);
  }

  return (
    <div className="input-modal-overlay" onClick={handleOverlayClick}>
      <div className="input-modal">
        {selectedTodo?.todo?.id && (
          <DeleteTodo
            todoId={selectedTodo.todo.id}
            groupId={selectedTodo.groupId}
          />
        )}
        {selectedTodo?.todo?.id && (
          <div
            ref={contentEl}
            className="input-modal-content"
            contentEditable="true"
            onKeyUp={handleInput}
            suppressContentEditableWarning={true}
          >
            {selectedTodo.todo?.content}
          </div>
        )}
      </div>
    </div>
  );
};
