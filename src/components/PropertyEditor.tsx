import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";

const Root = styled.div`
  flex: 1;
  overflow: auto;
`;

const PropertyEditor = () => {
  const { canvasStore } = useStores();
  return (
    <Root>
      <pre>{JSON.stringify(canvasStore.selectedElement, null, 2)}</pre>
    </Root>
  );
};

export default observer(PropertyEditor);
