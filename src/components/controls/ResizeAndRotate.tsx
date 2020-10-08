import { observer } from "mobx-react";
import React, { useEffect, useRef } from "react";

import { BoundingBox } from "../../draw/shape";
import { Transform } from "../../draw/transform";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";

type ResizeEdge =
  | "n"
  | "e"
  | "s"
  | "w"
  | "ne"
  | "nw"
  | "se"
  | "sw"
  | "ew"
  | "ns";

const Root = styled.div`
  position: absolute;
  box-sizing: border-box;
  transform-origin: top left;
  outline: 1px solid ${({ theme }) => theme.palette.primary};
`;

const getControlPointPositionStyle = (edge: ResizeEdge): string => {
  switch (edge) {
    case "nw":
      return `
        cursor: nwse-resize;
        top: -5px;
        left: -5px;
      `;
    case "n":
      return `
        cursor: n-resize;
        top: -5px;
        left: calc(50% - 4px);
      `;
    case "ne":
      return `
        cursor: nesw-resize;
        top: -5px;
        right: -5px;
      `;
    case "e":
      return `
        cursor: ew-resize;
        top: calc(50% - 4px);
        right: -5px;
      `;
    case "se":
      return `
        cursor: nwse-resize;
        bottom: -5px;
        right: -5px;
      `;
    case "s":
      return `
        cursor: ns-resize;
        bottom: -5px;
        left: calc(50% - 4px);
      `;
    case "sw":
      return `
        cursor: nesw-resize;
        bottom: -5px;
        left: -5px;
      `;
    case "w":
      return `
        cursor: ew-resize;
        top: calc(50% - 4px);
        left: -5px;
      `;
    default:
      return "";
  }
};

const ControlPoint = styled.div<{ resizeEdge: ResizeEdge }>`
  position: absolute;
  pointer-events: all;
  width: 8px;
  height: 8px;
  ${({ resizeEdge }) => getControlPointPositionStyle(resizeEdge)}
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 50%;
  background-color: #fff;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary};
  }

  /* &::after {
    position: absolute;
    content: "";
    display: block;
    cursor: s-resize;
    width: 5px;
    height: 5px;
    background: red;
    right: 2px;
  } */
`;

const ResizeAndRotate = () => {
  const { canvasStore, canvasMouseStore } = useStores();
  const initialBoundingBoxRef = useRef<BoundingBox | null>(null);
  const selectedEdgeRef = useRef<ResizeEdge | null>(null);

  const { selectedElement } = canvasStore;
  const {
    isMainButtonDown,
    isMouseMoving,
    mouseDownX,
    mouseDownY,
    currentMouseX,
    currentMouseY,
    mouseButton,
  } = canvasMouseStore;

  useEffect(() => {
    if (!selectedElement || !isMainButtonDown) {
      initialBoundingBoxRef.current = null;
    } else {
      initialBoundingBoxRef.current = selectedElement.getBoundingBox();
    }
  }, [selectedElement, isMainButtonDown]);

  if (!selectedElement) return null;
  const boundingBox = selectedElement.getBoundingBox();
  if (!boundingBox.width && !isMainButtonDown) return null;
  let currentRect = boundingBox;

  if (isMainButtonDown && initialBoundingBoxRef.current) {
    const { x, y, width, height } = initialBoundingBoxRef.current;
    const tx = currentMouseX - mouseDownX!;
    const ty = currentMouseY - mouseDownY!;
    const transform = new Transform();
    currentRect = new BoundingBox(x, y, width, height, transform);

    switch (selectedEdgeRef.current) {
      case "nw":
        break;
      case null:
        transform.tx = tx;
        transform.ty = ty;
        break;
      default:
        break;
    }

    transform.multiply(initialBoundingBoxRef.current.transform.toMatrix());

    // currentRect = transformBoundingRect(initialRectRef.current, transform);
    // console.log("selectedEdgeRef.current: ", selectedEdgeRef.current);
  }

  const handleOnDrag = (e: React.MouseEvent) => {
    const rect = canvasMouseStore.containerDomElement!.getBoundingClientRect();
    canvasMouseStore.update({
      isMouseMoving: true,
      currentMouseX: e.clientX - rect.x,
      currentMouseY: e.clientY - rect.y,
    });
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    selectedEdgeRef.current = null;
    canvasMouseStore.update({
      isMouseDown: false,
    });
  };

  return (
    <Root
      style={{
        left: currentRect.x,
        top: currentRect.y,
        width: currentRect.width,
        height: currentRect.height,
        transform: `matrix(
          ${currentRect.transform.a},
          ${currentRect.transform.b},
          ${currentRect.transform.c},
          ${currentRect.transform.d},
          ${currentRect.transform.tx},
          ${currentRect.transform.ty})`,
      }}
    >
      <ControlPoint
        resizeEdge="nw"
        draggable
        onDragStart={() => {
          console.log("dddstart");
          selectedEdgeRef.current = "nw";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="n"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "n";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="ne"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "ne";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="e"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "e";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="se"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "se";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="s"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "w";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="sw"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "sw";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
      <ControlPoint
        resizeEdge="w"
        draggable
        onDragStart={(e) => {
          selectedEdgeRef.current = "w";
        }}
        onDrag={handleOnDrag}
        onDragEnd={handleDragEnd}
      />
    </Root>
  );
};

export default observer(ResizeAndRotate);
