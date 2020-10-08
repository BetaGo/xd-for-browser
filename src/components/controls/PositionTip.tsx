import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";

const Root = styled.div`
  pointer-events: none;
  display: inline-block;
  position: absolute;
  top: 0;
  right: 0;
  background: #fff;
  border: 1px solid #000;
`;

const PositionTip = () => {
  const { canvasMouseStore } = useStores();
  return (
    <Root>
      x: {canvasMouseStore.currentMouseX}
      <br />
      y: {canvasMouseStore.currentMouseY}
    </Root>
  );
};

export default observer(PositionTip);
