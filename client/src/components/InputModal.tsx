import React, { useState } from "react";
import { TodoType } from "../@types";

interface Props {
  todo: TodoType;
}
export const InputModal: React.FC<Props> = ({ todo }) => {
  const [newContent, setNewContent] = useState(todo.content);
  function handleInput(event: React.KeyboardEvent) {
    // @ts-ignore
    const updatedContent = event.target?.textContent;
    console.log(updatedContent);
    setNewContent(updatedContent);
  }
  return (
    <div className="input-modal-overlay">
      <div
        className="input-modal"
        contentEditable="true"
        onKeyPress={handleInput}
      >
        {newContent}
      </div>
    </div>
  );
};
