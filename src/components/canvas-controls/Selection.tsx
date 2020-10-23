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
    !canvasMouseStore.isMainButtonDown ||
    (canvasMouseStore.isMouseDown && canvasStore.selectedElement)
  ) {
    return null;
  }

  const {
    mouseDownDomX,
    mouseDownDomY,
    currentMouseDomX,
    currentMouseDomY,
  } = canvasMouseStore;

  const left = Math.min(mouseDownDomX!, currentMouseDomX);
  const top = Math.min(mouseDownDomY!, currentMouseDomY);
  const width = Math.abs(mouseDownDomX! - currentMouseDomX);
  const height = Math.abs(mouseDownDomY! - currentMouseDomY);

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
