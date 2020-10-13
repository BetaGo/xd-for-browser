import { observer } from "mobx-react";
import React, { useEffect, useRef, useState } from "react";

import { Element } from "../../draw/element";
import { IElementEvent } from "../../draw/events";
import { IBoundingRect } from "../../draw/shape";
import { radian2Degree } from "../../draw/utils";
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

const calculateBoundingRect = (element: Element): IBoundingRect => {
  const currentBoundingBox = element.getBoundingBox();
  const t = currentBoundingBox.getTransformed();
  const boundingRect: IBoundingRect = {
    x: currentBoundingBox.transform.tx + currentBoundingBox.x,
    y: currentBoundingBox.transform.ty + currentBoundingBox.y,
    width: t.width,
    height: t.height,
  };
  return boundingRect;
};

const ResizeAndRotate = () => {
  const { canvasStore } = useStores();
  const selectedEdgeRef = useRef<ResizeEdge | null>(null);

  const { selectedElement } = canvasStore;
  const [boundingRect, setBoundingRect] = useState<IBoundingRect | undefined>();

  useEffect(() => {
    const handleBoundingChange = (e: IElementEvent) => {
      setBoundingRect(calculateBoundingRect(e.target));
    };
    if (selectedElement) {
      setBoundingRect(calculateBoundingRect(selectedElement));
      selectedElement.on("boundingChange", handleBoundingChange);
      return () => {
        selectedElement.off("boundingChange", handleBoundingChange);
      };
    }
  }, [selectedElement]);

  if (!selectedElement) return null;

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
    <Root
      style={{
        left: 0,
        top: 0,
        width: boundingRect?.width,
        height: boundingRect?.height,
        transform: `translate(${boundingRect?.x}px, ${
          boundingRect?.y
        }px) rotate(${radian2Degree(selectedElement.rotation ?? 0)}deg)`,
        transformOrigin: "top left",
        willChange: "transform",
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
