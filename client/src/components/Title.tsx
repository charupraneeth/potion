import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useRef, useState } from "react";
import { StoreModel } from "../store";

function Title() {
  const title = useStoreState((state: StoreModel) => state.metaData.title);
  const updaterThunk = useStoreActions(
    (actions: Actions<StoreModel>) => actions.updateData
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
          updaterThunk({
            type: "setMetaData",
            payload: { content: "", type: "title" },
          });
          return;
        }
        updaterThunk({
          type: "setMetaData",
          payload: { content: e.currentTarget.textContent, type: "title" },
        });
      }}
      contentEditable="true"
      suppressContentEditableWarning={true}
    >
      {firstTitle}
    </div>
  );
}

export default Title;
