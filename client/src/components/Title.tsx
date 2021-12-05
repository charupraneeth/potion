import { useEffect, useRef, useState } from "react";

function Title() {
  const [title, setTitle] = useState("This is the title");

  const firstTitle = "This is the title";

  // const titleEl = useRef(null);
  // useEffect(() => {
  //   if (!titleEl.current) return;
  // @ts-ignore
  //   titleEl.current.textContent = title;
  // }, [title]);
  return (
    <div
      className={`todos-title editable`}
      onKeyDown={(e) => {
        console.log("changed");
        // @ts-ignore
        if (!e?.currentTarget?.textContent) {
          setTitle("");
          return;
        }

        setTitle(e.currentTarget.textContent);
      }}
      contentEditable="true"
      suppressContentEditableWarning={true}
    >
      {firstTitle}
    </div>
  );
}

export default Title;
