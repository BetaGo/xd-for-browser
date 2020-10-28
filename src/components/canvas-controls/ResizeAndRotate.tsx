import { observer } from "mobx-react";
import React, { useRef } from "react";

import { IBoundingRect } from "../../draw/shape";
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
  pointer-events: none;
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
  const { canvasStore } = useStores();
  const selectedEdgeRef = useRef<ResizeEdge | null>(null);

  const dpr = canvasStore.dpr;
  const scale = canvasStore.zoomValue;
  const { e, f } = canvasStore.transform || {};

  const getStyles = (): React.CSSProperties => {
    if (!canvasStore.selectedElements.size) return {};
    let rectList: IBoundingRect[] = [];
    canvasStore.selectedElements.forEach((v) => {
      let d = {
        x: v.globalBounds.x,
        y: v.globalBounds.y,
        width: v.globalBounds.width,
        height: v.globalBounds.height,
      };
      rectList.push(d);
    });
    console.log(rectList);
    const res = rectList.reduce((a, b) => {
      let x = Math.min(a.x, b.x);
      let y = Math.min(a.y, b.y);
      let width = Math.max(a.x + a.width - x, b.x + b.width - x);
      let height = Math.max(a.y + a.height - y, b.y + b.height - y);
      return { x, y, width, height };
    });
    return {
      top: res.y * scale + (f ?? 0) / dpr,
      left: res.x * scale + (e ?? 0) / dpr,
      width: res.width * scale,
      height: res.height * scale,
    };
  };

  // const { selectedElement, selectedElements } = canvasStore;

  // if (!selectedElement) return null;

  const handleOnDrag = (e: React.MouseEvent) => {
    // const rect = canvasMouseStore.containerDomElement!.getBoundingClientRect();
    // canvasMouseStore.update({
    //   isMouseMoving: true,
    //   currentMouseX: e.clientX - rect.x,
    //   currentMouseY: e.clientY - rect.y,
    // });
  };

  const handleDragEnd = (e: React.MouseEvent) => {
    // selectedEdgeRef.current = null;
    // canvasMouseStore.update({
    //   isMouseDown: false,
    // });
  };

  return (
    <Root style={getStyles()}>
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
