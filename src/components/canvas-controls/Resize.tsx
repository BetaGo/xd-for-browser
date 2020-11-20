import { observer } from "mobx-react";
import React, { useCallback, useEffect, useRef } from "react";
import { MouseEventButton } from "../../constants";

import { IBoundingRect } from "../../draw/shape";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { Point } from "../../utils/geometry";
import { Rectangle } from "../../xd/scenegraph/rectangle";
import { getBoundingRectPoints } from "../../xd/sceneNode.helpers";

import { afterBoundsChange } from "../../reactions/helpers/afterNodeBoundsChange";
import { runInAction } from "mobx";

type ResizeEdge = "n" | "e" | "s" | "w" | "ne" | "nw" | "se" | "sw";

const edgeRotateDegreeDict: Record<ResizeEdge, number> = {
  n: 0,
  e: 90,
  s: 180,
  w: 270,
  ne: 45,
  nw: 315,
  se: 135,
  sw: 225,
};

const Root = styled.div`
  position: absolute;
  box-sizing: border-box;
  transform-origin: top left;
  outline: 1px solid ${({ theme }) => theme.palette.primary};
`;

const getControlPointPositionStyle = (
  edge: ResizeEdge,
  rotation: number
): string => {
  let r =
    ((rotation % 45 > 22.5 ? 1 : 0) + Math.floor(rotation / 45)) * 45 +
    edgeRotateDegreeDict[edge];
  r = ((r % 180) + 180) % 180;

  let cursor = "";
  if (r / 45 === 0) {
    cursor = "ns-resize";
  } else if (r / 45 === 1) {
    cursor = "nesw-resize";
  } else if (r / 45 === 2) {
    cursor = "ew-resize";
  } else if (r / 45 === 3) {
    cursor = "nwse-resize";
  }

  switch (edge) {
    case "nw":
      return `
        cursor: ${cursor};
        top: -5px;
        left: -5px;
      `;
    case "n":
      return `
        cursor: ${cursor};
        top: -5px;
        left: calc(50% - 4px);
      `;
    case "ne":
      return `
        cursor: ${cursor};
        top: -5px;
        right: -5px;
      `;
    case "e":
      return `
        cursor: ${cursor};
        top: calc(50% - 4px);
        right: -5px;
      `;
    case "se":
      return `
        cursor: ${cursor};
        bottom: -5px;
        right: -5px;
      `;
    case "s":
      return `
        cursor: ${cursor};
        bottom: -5px;
        left: calc(50% - 4px);
      `;
    case "sw":
      return `
        cursor: ${cursor};
        bottom: -5px;
        left: -5px;
      `;
    case "w":
      return `
        cursor: ${cursor};
        top: calc(50% - 4px);
        left: -5px;
      `;
    default:
      return "";
  }
};

const ControlPoint = styled.div<{
  resizeEdge: ResizeEdge;
  currentRotation: number;
}>`
  ${({ resizeEdge, currentRotation }) =>
    getControlPointPositionStyle(resizeEdge, currentRotation)}
  position: absolute;
  pointer-events: all;
  width: 8px;
  height: 8px;
  border: 1px solid ${({ theme }) => theme.palette.primary};
  border-radius: 50%;
  background-color: #fff;

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary};
  }
`;

const Resize = () => {
  const { canvasStore } = useStores();
  const selectedEdgeRef = useRef<ResizeEdge | null>(null);
  const rootNodeRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const preMovePointRef = useRef<Point | null>(null);

  const dpr = canvasStore.dpr;
  const scale = canvasStore.zoomValue;
  const { e, f } = canvasStore.transform || {};

  const getStyles = (): React.CSSProperties => {
    let items = canvasStore.selection.items;
    if (!items.length)
      return {
        display: "none",
      };
    let res: IBoundingRect;
    if (items.length === 1) {
      let item = items[0];
      res = item.globalBounds;
    } else {
      let vertexList: Point[] = [];
      items.forEach((v) => {
        vertexList = vertexList.concat(
          getBoundingRectPoints(v.localBounds, v.globalTransform)
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
    rotationRef.current = rotateDeg;
    return {
      top: res.y * scale + (f ?? 0) / dpr,
      left: res.x * scale + (e ?? 0) / dpr,
      width: res.width * scale,
      height: res.height * scale,
      transform: `rotate(${rotateDeg}deg)`,
    };
  };

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === MouseEventButton.Main) {
      preMovePointRef.current = { x: e.clientX, y: e.clientY };
      if (e.target instanceof HTMLElement) {
        selectedEdgeRef.current = e.target.dataset.edge as ResizeEdge;
      }
    } else {
      preMovePointRef.current = null;
      selectedEdgeRef.current = null;
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!preMovePointRef.current || !selectedEdgeRef.current) return;
      let selectedItems = canvasStore.selection.items;
      if (!selectedItems.length) return;

      const prePoint = preMovePointRef.current;
      const curPoint: Point = { x: e.clientX, y: e.clientY };

      const prePointInCanvas = canvasStore.clientPoint2CanvasPoint(prePoint);
      const curPointInCanvas = canvasStore.clientPoint2CanvasPoint(curPoint);
      const dx = curPointInCanvas.x - prePointInCanvas.x;
      const dy = curPointInCanvas.y - prePointInCanvas.y;

      if (!(dx || dy)) {
        return;
      }

      runInAction(() => {
        if (selectedItems.length > 1) {
          // TODO: 多个选中图形的 resize
          return;
        }

        const selectedItem = selectedItems[0];

        const resizeEdge = selectedEdgeRef.current;
        switch (resizeEdge) {
          case "nw":
            break;
          case "e": {
            if (selectedItem instanceof Rectangle) {
              selectedItem.width += dx;
            }
            break;
          }
          case "se": {
            if (selectedItem instanceof Rectangle) {
              selectedItem.width += dx;
              selectedItem.height += dy;
            }
            break;
          }
          case "s": {
            if (selectedItem instanceof Rectangle) {
              selectedItem.height += dy;
            }
            break;
          }
          default:
            break;
        }

        preMovePointRef.current = curPoint;
        canvasStore.render();
        afterBoundsChange(selectedItem);
      });
    },
    [canvasStore]
  );

  const handleMouseUp = (e: MouseEvent) => {
    preMovePointRef.current = null;
    selectedEdgeRef.current = null;
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    const rootNode = rootNodeRef.current!;

    rootNode.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      rootNode.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseMove]);

  const styles = getStyles();
  return (
    <Root style={styles} ref={rootNodeRef}>
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="nw"
        data-edge="nw"
      ></ControlPoint>
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="n"
        data-edge="n"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="ne"
        data-edge="ne"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="e"
        data-edge="e"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="se"
        data-edge="se"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="s"
        data-edge="s"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="sw"
        data-edge="sw"
      />
      <ControlPoint
        currentRotation={rotationRef.current}
        resizeEdge="w"
        data-edge="w"
      />
    </Root>
  );
};

export default observer(Resize);
