import React, { useState } from "react";

export const InputModal = ({ content }) => {
  const [newContent, setNewContent] = useState(content);
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
