import { observer } from "mobx-react";
import React from "react";

import { DesignTool, MouseEventButton } from "../../constants";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";

const Root = styled.div`
  position: absolute;
  border: 1px solid #fff;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.primary};
    opacity: 0.2;
  }
`;

const Selection = () => {
  const { uiStore, canvasMouseStore, canvasStore } = useStores();

  if (
    uiStore.selectedDesignTool !== DesignTool.Select ||
    !canvasMouseStore.isMouseDown ||
    canvasMouseStore.mouseButton !== MouseEventButton.Main ||
    (canvasMouseStore.isMouseDown && canvasStore.selectedElement)
  ) {
    return null;
  }

  const {
    mouseDownX,
    mouseDownY,
    currentMouseX,
    currentMouseY,
  } = canvasMouseStore;

  const left = Math.min(mouseDownX!, currentMouseX);
  const top = Math.min(mouseDownY!, currentMouseY);
  const width = Math.abs(mouseDownX! - currentMouseX);
  const height = Math.abs(mouseDownY! - currentMouseY);

  return (
    <Root
      style={{
        left,
        top,
        width,
        height,
      }}
    ></Root>
  );
};

export default observer(Selection);
