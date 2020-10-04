import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../hooks/useStores";

const PropertyEditor = () => {
  const { canvasStore } = useStores();
  console.log(canvasStore.selectedElement);
  return (
    <div>
      <pre>{JSON.stringify(canvasStore.selectedElement, null, 2)}</pre>
    </div>
  );
};

export default observer(PropertyEditor);
