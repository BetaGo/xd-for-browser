import React, { useEffect, useRef } from "react";

import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";
import PositionTip from "./canvas-controls/PositionTip";
import ResizeAndRotate from "./canvas-controls/ResizeAndRotate";
import Selection from "./canvas-controls/Selection";

const Root = styled.div`
  position: relative;
  display: flex;
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
    canvasMouseStore.containerDomElement = canvasContainerRef.current!;
  }, [canvasMouseStore, canvasStore]);

  useEffect(() => {
    let mouseMoveDetectTimer: ReturnType<typeof setTimeout>;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = operationLayerRef.current!.getBoundingClientRect();

      canvasMouseStore.update({
        isMouseMoving: true,
        currentMouseX: e.clientX - rect.x,
        currentMouseY: e.clientY - rect.y,
      });
      mouseMoveDetectTimer && clearTimeout(mouseMoveDetectTimer);
      mouseMoveDetectTimer = setTimeout(() => {
        canvasMouseStore.update({
          isMouseMoving: false,
        });
      }, 500);
    };
    const handleMouseUp = (e: MouseEvent) => {
      const rect = operationLayerRef.current!.getBoundingClientRect();

      canvasMouseStore.update({
        isMouseDown: false,
        isMouseMoving: false,
        mouseButton: e.button,
        mouseUpX: e.clientX - rect.x,
        mouseUpY: e.clientY - rect.y,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      mouseMoveDetectTimer && clearTimeout(mouseMoveDetectTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasMouseStore]);

  return (
    <Root
      onMouseDown={(e) => {
        const rect = operationLayerRef.current!.getBoundingClientRect();
        canvasMouseStore.update({
          isMouseDown: true,
          isMouseMoving: false,
          mouseButton: e.button,
          mouseDownX: e.clientX - rect.x,
          mouseDownY: e.clientY - rect.y,
        });
      }}
      ref={canvasContainerRef}
    >
      <OperationLayer ref={operationLayerRef}>
        <Selection></Selection>
        <ResizeAndRotate></ResizeAndRotate>
        <PositionTip />
      </OperationLayer>
    </Root>
  );
};

export default Canvas;
