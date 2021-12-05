import { useEffect, useRef, useState } from "react";

const Description = () => {
  const [description, setDescription] = useState("This is Description");

  const counter = useRef(0);

  const firstDescription = "This is Description";
  return (
    <p
      className="todos-description editable"
      contentEditable="true"
      suppressContentEditableWarning={true}
      onKeyDown={(e) => {
        // @ts-ignore
        if (!e?.currentTarget?.textContent) {
          setDescription("");
          return;
        }
        setDescription(e.currentTarget.textContent);
      }}
    >
      {firstDescription}
    </p>
  );
};

export default Description;
