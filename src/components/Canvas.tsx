import styled from "@emotion/styled";
import { runInAction } from "mobx";
import React, { useEffect, useRef } from "react";

import { useStores } from "../hooks/useStores";
import Selection from "./controls/Selection";

const Root = styled.div`
  position: relative;
  display: flex;
  flex: 1;
`;

const CanvasContainer = styled.div`
  flex: 1;
`;
const OperationLayer = styled.div`
  pointer-events: none;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const Canvas = () => {
  const { canvasStore, canvasMouseStore } = useStores();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const operationLayerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    canvasStore.initRender(canvasContainerRef.current!);
  }, [canvasStore]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const rect = operationLayerRef.current!.getBoundingClientRect();

      runInAction(() => {
        canvasMouseStore.currentMouseX = e.clientX - rect.x;
        canvasMouseStore.currentMouseY = e.clientY - rect.y;
      });
    };
    const handleMouseUp = (e: MouseEvent) => {
      const rect = operationLayerRef.current!.getBoundingClientRect();
      runInAction(() => {
        canvasMouseStore.isMouseDown = false;
        canvasMouseStore.isMouseUp = true;
        canvasMouseStore.mouseUpX = e.clientX - rect.x;
        canvasMouseStore.mouseUpY = e.clientY - rect.y;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasMouseStore]);

  return (
    <Root>
      <CanvasContainer
        onMouseDown={(e) => {
          const rect = operationLayerRef.current!.getBoundingClientRect();
          runInAction(() => {
            canvasMouseStore.isMouseDown = true;
            canvasMouseStore.isMouseUp = false;
            canvasMouseStore.mouseDownX = e.clientX - rect.x;
            canvasMouseStore.mouseDownY = e.clientY - rect.y;
          });
        }}
        ref={canvasContainerRef}
      ></CanvasContainer>
      <OperationLayer ref={operationLayerRef}>
        <Selection></Selection>
      </OperationLayer>
    </Root>
  );
};

export default Canvas;
