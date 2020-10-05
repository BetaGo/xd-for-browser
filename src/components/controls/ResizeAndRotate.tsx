import { observer } from "mobx-react";
import React from "react";
import { useStores } from "../../hooks/useStores";

import styled from "../../styles/styled";

const Root = styled.div`
  position: absolute;
  box-sizing: border-box;
  outline: 1px solid ${({ theme }) => theme.palette.primary};
`;

const ResizeAndRotate = () => {
  const { canvasStore, canvasMouseStore } = useStores();
  const selectedElement = canvasStore.selectedElement;

  if (!selectedElement) return null;
  const rect = selectedElement.getBoundingRect();
  const {
    isMouseDown,
    isMouseMoving,
    currentMouseX,
    currentMouseY,
  } = canvasMouseStore;
  return (
    <Root
      style={{
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
      }}
    ></Root>
  );
};

export default observer(ResizeAndRotate);
