import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";
import { useHistory } from "react-router-dom";

import { Artboard } from "../draw/elements/artboard";
import { IPoint } from "../draw/utils";
import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";
import ArtboardTitle from "./canvas-controls/ArtboardTitle";
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
  const { canvasStore, canvasMouseStore, projectStore } = useStores();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const operationLayerRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  useEffect(() => {
    if (!projectStore.rootNode) {
      history.replace("/");
      return;
    }
    canvasStore.initRender(canvasContainerRef.current!, projectStore.rootNode);
    runInAction(() => {
      canvasMouseStore.containerDomElement = canvasContainerRef.current!;
    });
  }, [canvasMouseStore, canvasStore, history, projectStore]);

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

  const handleWheelEvent = (e: React.WheelEvent) => {
    if (e.altKey) {
      const nextScale = canvasStore.zoomValue - (e.deltaY / 100) * 0.2;
      const rect = operationLayerRef.current!.getBoundingClientRect();
      const mousePoint: IPoint = {
        x: e.clientX - rect.x,
        y: e.clientY - rect.y,
      };
      canvasStore.zoom(nextScale, mousePoint);
    } else {
      const scrollY = -e.deltaY;
      canvasStore.gRender?.transform.translate(0, scrollY);
      canvasStore.render();
    }
  };

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
      onWheel={handleWheelEvent}
      ref={canvasContainerRef}
    >
      <OperationLayer ref={operationLayerRef}>
        {canvasStore.artboards.map((v) => (
          <ArtboardTitle artboard={v as Artboard} key={v.guid} />
        ))}
        <Selection></Selection>
        <ResizeAndRotate></ResizeAndRotate>
        <PositionTip />
      </OperationLayer>
    </Root>
  );
};

export default observer(Canvas);
