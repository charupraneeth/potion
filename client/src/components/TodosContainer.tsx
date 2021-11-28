import React, { useRef, useState } from "react";
import { InputModal } from "./InputModal";
import Todo from "./Todo";

function TodosContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  const [todos, setTodos] = useState([
    "this is your first todo",
    "this is second todo",
    "this is third todo",
    "this is fourth todo",
  ]);

  function getDragAfterElement(container: HTMLDivElement, y: number) {
    const draggableElements = [
      ...container.querySelectorAll(".draggable:not(.dragging)"),
    ];

    const el = draggableElements.reduce(
      (closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;

        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      },
      { offset: Number.NEGATIVE_INFINITY }
    );
    return el.element;
  }

  function handleDragOver(event: React.DragEvent) {
    event.preventDefault();
    if (!containerRef.current) return;
    const afterElement = getDragAfterElement(
      containerRef.current,
      event.clientY
    );
    const draggable = document.querySelector(".dragging");
    if (!draggable) return;
    if (!containerRef.current) return;
    if (afterElement == null) {
      containerRef.current.appendChild(draggable);
    } else {
      containerRef.current.insertBefore(draggable, afterElement);
    }
  }

  return (
    <div>
      <div
        className="todo-group"
        ref={containerRef}
        onDragOver={handleDragOver}
      >
        {todos.map((todo, index) => {
          return <Todo key={index} content={todo} />;
        })}
      </div>
    </div>
  );
}

export default TodosContainer;
