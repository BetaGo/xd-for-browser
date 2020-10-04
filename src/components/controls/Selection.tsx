import styled from "@emotion/styled";
import { observer } from "mobx-react";
import React from "react";

import { DesignTool } from "../../constants";
import { useStores } from "../../hooks/useStores";

const Root = styled.div`
  position: absolute;
  border: 1px solid #fff;
  background-color: rgba(20, 145, 229, 0.1);
  overflow: hidden;
`;

const Selection = () => {
  const { uiStore, canvasMouseStore } = useStores();
  if (
    uiStore.selectedDesignTool !== DesignTool.Select ||
    !canvasMouseStore.isMouseDown
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
