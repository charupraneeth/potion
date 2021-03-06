import { Actions, useStoreActions, useStoreState } from "easy-peasy";
import { useEffect, useRef, useState } from "react";
import { StoreModel } from "../store";

const Description = () => {
  const description = useStoreState(
    (state: StoreModel) => state.metaData.description
  );
  const setMetaData = useStoreActions(
    (actions: Actions<StoreModel>) => actions.setMetaData
  );
  const updaterThunk = useStoreActions(
    (actions: Actions<StoreModel>) => actions.updateData
  );
  const firstDescription = description;
  return (
    <p
      className="todos-description editable"
      contentEditable="true"
      suppressContentEditableWarning={true}
      onBlur={(e) => {
        // @ts-ignore
        if (!e?.currentTarget?.textContent) {
          updaterThunk({
            type: "setMetaData",
            payload: { content: "", type: "description" },
          });

          return;
        }

        updaterThunk({
          type: "setMetaData",
          payload: {
            content: e.currentTarget.textContent,
            type: "description",
          },
        });
      }}
    >
      {firstDescription}
    </p>
  );
};

export default Description;
