import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useRef } from "react";
import { ContextMenuTrigger } from "react-contextmenu";
import { useHistory } from "react-router-dom";

import { Artboard } from "../draw/elements/artboard";
import { Point } from "../utils/geometry";
import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";
import ArtboardTitle from "./canvas-controls/ArtboardTitle";
import PositionTip from "./canvas-controls/PositionTip";
// import ResizeAndRotate from "./canvas-controls/ResizeAndRotate";
import Selection from "./canvas-controls/Selection";
import CanvasContextMenu from "./CanvasContextMenu";
import Resize from "./canvas-controls/Resize";
import Rotate from "./canvas-controls/Rotate";

const Root = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  background-color: RGB(228, 228, 228);
`;

const CanvasContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  overflow: hidden;
`;

const OperationLayer = styled(CanvasContainer)`
  pointer-events: none;
`;

const Canvas = () => {
  const { canvasStore, canvasMouseStore, projectStore } = useStores();
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const operationLayerRef = useRef<HTMLDivElement>(null);
  const history = useHistory();

  const getCanvasPointFromEvent = useCallback(
    (e: MouseEvent | React.WheelEvent | React.MouseEvent) => {
      const rect = operationLayerRef.current!.getBoundingClientRect();
      const domX = e.clientX - rect.x;
      const tx = canvasStore.transform?.e ?? 0;
      const domY = e.clientY - rect.y;
      const ty = canvasStore.transform?.f ?? 0;
      const x = (domX - tx / canvasStore.dpr) / canvasStore.zoomValue;
      const y = (domY - ty / canvasStore.dpr) / canvasStore.zoomValue;
      return { domX, domY, x, y };
    },
    [
      canvasStore.dpr,
      canvasStore.transform?.e,
      canvasStore.transform?.f,
      canvasStore.zoomValue,
    ]
  );

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
      const point = getCanvasPointFromEvent(e);
      canvasMouseStore.update({
        isMouseMoving: true,
        currentMouseX: point.x,
        currentMouseY: point.y,
        currentMouseDomX: point.domX,
        currentMouseDomY: point.domY,
      });
      mouseMoveDetectTimer && clearTimeout(mouseMoveDetectTimer);
      mouseMoveDetectTimer = setTimeout(() => {
        canvasMouseStore.update({
          isMouseMoving: false,
        });
      }, 500);
    };
    const handleMouseUp = (e: MouseEvent) => {
      const point = getCanvasPointFromEvent(e);
      canvasMouseStore.update({
        isMouseDown: false,
        isMouseMoving: false,
        mouseButton: e.button,
        mouseUpX: point.x,
        mouseUpY: point.y,
        mouseUpDomX: point.domX,
        mouseUpDomY: point.domY,
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      mouseMoveDetectTimer && clearTimeout(mouseMoveDetectTimer);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [canvasMouseStore, getCanvasPointFromEvent]);

  useEffect(() => {
    const handleWheelEvent = (e: WheelEvent) => {
      e.preventDefault();
      if (e.altKey || e.ctrlKey) {
        const nextScale = canvasStore.zoomValue * (1 - (e.deltaY / 100) * 0.2);
        const point = getCanvasPointFromEvent(e);
        const mousePoint: Point = {
          x: point.domX,
          y: point.domY,
        };
        canvasStore.zoom(nextScale, mousePoint);
      } else {
        const scrollY = -e.deltaY;
        const scrollX = -e.deltaX;
        canvasStore.gRender?.translate(scrollX, scrollY);
        canvasStore.render();
      }
    };
    const element = canvasContainerRef.current;
    element?.addEventListener("wheel", handleWheelEvent, {
      passive: false,
    });

    return () => {
      element?.removeEventListener("wheel", handleWheelEvent);
    };
  }, [canvasStore, getCanvasPointFromEvent]);

  return (
    <Root>
      <ContextMenuTrigger id="canvas_menu" holdToDisplay={-1}>
        <CanvasContainer
          onMouseDown={(e) => {
            const point = getCanvasPointFromEvent(e);
            canvasMouseStore.update({
              isMouseDown: true,
              isMouseMoving: false,
              mouseButton: e.button,
              mouseDownX: point.x,
              mouseDownY: point.y,
              mouseDownDomX: point.domX,
              mouseDownDomY: point.domY,
            });
          }}
          ref={canvasContainerRef}
        />
      </ContextMenuTrigger>
      <OperationLayer ref={operationLayerRef}>
        {canvasStore.artboards.map((v) => (
          <ArtboardTitle artboard={v as Artboard} key={v.guid} />
        ))}
        <Selection></Selection>
        {/* <ResizeAndRotate></ResizeAndRotate> */}
        <Resize />
        <Rotate />
        <PositionTip />
      </OperationLayer>
      <CanvasContextMenu />
    </Root>
  );
};

export default observer(Canvas);
