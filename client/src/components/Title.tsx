import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useRef, useState } from "react";
import { StoreModel } from "../store";

function Title() {
  const title = useStoreState((state: StoreModel) => state.metaData.title);
  const setMetaData = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setMetaData
  );
  const firstTitle = title;

  // const titleEl = useRef(null);
  // useEffect(() => {
  //   if (!titleEl.current) return;
  // @ts-ignore
  //   titleEl.current.textContent = title;
  // }, [title]);
  return (
    <div
      className={`todos-title editable`}
      onBlur={(e) => {
        console.log("changed");
        // @ts-ignore
        if (!e?.currentTarget?.textContent) {
          setMetaData({ content: "", type: "title" });
          return;
        }
        setMetaData({ content: e.currentTarget.textContent, type: "title" });
      }}
      contentEditable="true"
      suppressContentEditableWarning={true}
    >
      {firstTitle}
    </div>
  );
}

export default Title;
