import React, { useState } from "react";

interface Props {
  content: string;
}

const Todo: React.FC<Props> = ({ content }) => {
  const [dragging, setDragging] = useState(false);
  function handleClick(event: React.MouseEvent) {
    console.log("clicked");
  }

  return (
    <div
      className={`todo editable draggable ${dragging ? "dragging" : ""}`}
      draggable={true}
      suppressContentEditableWarning={true}
      onClick={handleClick}
      tabIndex={0}
      onDragStart={() => setDragging(true)}
      onDragEnd={() => setDragging(false)}
    >
      {content}
    </div>
  );
};

export default Todo;
