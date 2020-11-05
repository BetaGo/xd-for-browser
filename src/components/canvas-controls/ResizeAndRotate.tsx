import { observer } from "mobx-react";
import React, { useRef } from "react";

import { IBoundingRect } from "../../draw/shape";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { Point } from "../../utils/geometry";
import { getBoundingRectPoints } from "../../xd/sceneNode.helpers";

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
    let items = canvasStore.selection.items;
    if (!items.length) return {};
    let res: IBoundingRect;
    if (items.length === 1) {
      let item = items[0];
      res = item.globalBounds;
    } else {
      let vertexList: Point[] = [];
      items.forEach((v) => {
        vertexList = vertexList.concat(
          getBoundingRectPoints(v.localBounds, v.transform)
        );
      });
      let minX = Number.MAX_SAFE_INTEGER;
      let minY = Number.MAX_SAFE_INTEGER;
      let maxX = Number.MIN_SAFE_INTEGER;
      let maxY = Number.MIN_SAFE_INTEGER;
      vertexList.forEach((v) => {
        if (v.x > maxX) maxX = v.x;
        if (v.x < minX) minX = v.x;
        if (v.y > maxY) maxY = v.y;
        if (v.y < minY) minY = v.y;
      });
      res = {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY,
      };
    }

    let rotateDeg = items.length === 1 ? items[0].rotation : 0;
    return {
      top: res.y * scale + (f ?? 0) / dpr,
      left: res.x * scale + (e ?? 0) / dpr,
      width: res.width * scale,
      height: res.height * scale,
      transform: `rotate(${rotateDeg}deg)`,
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

  if (!canvasStore.selection.items.length) {
    return null;
  }
  const styles = getStyles();
  return (
    <Root style={styles}>
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
