import * as math from "mathjs";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React, { useCallback, useEffect, useRef } from "react";

import { MouseEventButton } from "../../constants";
import { IBoundingRect } from "../../draw/shape";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { Point } from "../../utils/geometry";
import { Vector } from "../../utils/geometry/vector";
import { radian2Degree } from "../../utils/math";
import { getBoundingRectPoints } from "../../xd/sceneNode.helpers";

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
  pointer-events: none;
  box-sizing: border-box;
  transform-origin: top left;
`;

const getControlPointPositionStyle = (
  edge: ResizeEdge,
  rotation: number
): string => {
  let r =
    ((rotation % 45 > 22.5 ? 1 : 0) + Math.floor(rotation / 45)) * 45 +
    edgeRotateDegreeDict[edge];
  r = ((r % 360) + 360) % 360;

  let rotateCursorCss = `
    &::after {
      cursor: url("${`${process.env.PUBLIC_URL}/images/cursor/rotate-${r}.png`}}") 12 12, auto;
        cursor: -webkit-image-set(
              url("${`${process.env.PUBLIC_URL}/images/cursor/rotate-${r}.png`}") 1x,
              url("${`${process.env.PUBLIC_URL}/images/cursor/rotate-${r}@2x.png`}") 2x
            )
            12 12,
          auto;
      }
    }
  `;

  switch (edge) {
    case "nw":
      return `
        top: 0;
        left: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "n":
      return `
        top: 0;
        left: 50%;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "ne":
      return `
        top: 0;
        right: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "e":
      return `
        top: 50%;
        right: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "se":
      return `
        bottom: 0;
        right: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "s":
      return `
        bottom: 0;
        left: 50%;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "sw":
      return `
        bottom: 0;
        left: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
      `;
    case "w":
      return `
        top: 50%;
        left: 0;
        transform: rotate(${edgeRotateDegreeDict[edge]}deg);
        ${rotateCursorCss}
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

  &:hover {
    background-color: ${({ theme }) => theme.palette.primary};
  }

  &::after {
    pointer-events: all;
    position: absolute;
    content: "";
    display: block;
    width: 8px;
    height: 8px;
    background: red;
    top: -16px;
    left: 50%;
    transform: translate(-50%, 0);
  }
`;

const ResizeAndRotate = () => {
  const { canvasStore } = useStores();
  const rootNodeRef = useRef<HTMLDivElement | null>(null);
  const rotationRef = useRef(0);
  const startRotatePointRef = useRef<Point | null>(null);
  const rotateCenterPointRef = useRef<Point | null>(null);

  const dpr = canvasStore.dpr;
  const scale = canvasStore.zoomValue;
  const { e, f } = canvasStore.transform || {};

  const handleMouseDown = (e: MouseEvent) => {
    if (e.button === MouseEventButton.Main) {
      startRotatePointRef.current = { x: e.screenX, y: e.screenY };
      const bounds = rootNodeRef.current!.getBoundingClientRect();
      const rotateCenter: Point = {
        x: bounds.x + bounds.width / 2,
        y: bounds.y + bounds.height / 2,
      };
      rotateCenterPointRef.current = rotateCenter;
    }
  };

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!startRotatePointRef.current || !rotateCenterPointRef.current) return;
      const currentX = e.clientX;
      const currentY = e.clientY;
      const rotateCenter = rotateCenterPointRef.current;
      let startVec = new Vector(
        startRotatePointRef.current.x - rotateCenter.x,
        startRotatePointRef.current.y - rotateCenter.y
      );
      let currentVec = new Vector(
        currentX - rotateCenter.x,
        currentY - rotateCenter.y
      );

      startRotatePointRef.current = {
        x: currentX,
        y: currentY,
      };

      const isRotateLeft =
        (math.cross(
          [currentVec.x, currentVec.y, 0],
          [startVec.x, startVec.y, 0]
        ) as number[])[2] > 0
          ? true
          : false;

      let rotateDeg = radian2Degree(currentVec.getAngle(startVec));
      if (isRotateLeft) {
        rotateDeg = -rotateDeg;
      }
      // const canvasCenter = canvasStore.clientPoint2CanvasPoint(rotateCenter);
      runInAction(() => {
        canvasStore.selection.items.forEach((node) => {
          // let globalBounds = node.globalBounds;
          // const rotateCenter: Point = {
          //   x: canvasCenter.x - globalBounds.x,
          //   y: canvasCenter.y - globalBounds.y,
          // };
          // const nodeCenter = node.globalTransform.transformPoint(
          //   node.localCenterPoint
          // );
          // const rotateCenter = {
          //   x: canvasCenter.x - nodeCenter.x,
          //   y: canvasCenter.y - nodeCenter.y,
          // };
          // console.log(rotateCenter);
          const rotateCenter = node.localCenterPoint;
          node.rotateAround(rotateDeg, rotateCenter);
        });
        canvasStore.render();
      });
    },
    [canvasStore]
  );

  const handleMouseUp = (e: MouseEvent) => {
    startRotatePointRef.current = null;
    rotateCenterPointRef.current = null;
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMouseMove);
    let rootNode = rootNodeRef.current!;
    rootNode.addEventListener("mousedown", handleMouseDown);
    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMouseMove);
      rootNode.removeEventListener("mousedown", handleMouseDown);
    };
  }, [handleMouseMove]);

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
    const s = {
      top: res.y * scale + (f ?? 0) / dpr,
      left: res.x * scale + (e ?? 0) / dpr,
      width: res.width * scale,
      height: res.height * scale,
      transform: `rotate(${rotateDeg}deg)`,
    };
    rotationRef.current = rotateDeg;
    return s;
  };

  const styles = getStyles();
  return (
    <Root style={styles} ref={rootNodeRef}>
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="nw" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="n" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="ne" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="e" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="se" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="s" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="sw" />
      <ControlPoint currentRotation={rotationRef.current} resizeEdge="w" />
    </Root>
  );
};

export default observer(ResizeAndRotate);
