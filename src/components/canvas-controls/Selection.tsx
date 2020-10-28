import { observer } from "mobx-react";
import React, { useEffect } from "react";

import { DesignTool, MouseEventButton } from "../../constants";
import { Artboard } from "../../draw/elements/artboard";
import { IGRenderElement } from "../../draw/elements/interface";
import { RootNode } from "../../draw/elements/rootNode";
import { RenderMouseEvent } from "../../draw/event";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { SceneNode } from "../../xd/scenegraph/sceneNode";

const Root = styled.div`
  position: absolute;
  border: 1px solid #fff;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.primary};
    opacity: 0.2;
  }
`;

const Selection = () => {
  const { uiStore, canvasMouseStore, canvasStore } = useStores();

  useEffect(() => {
    const handleMousedown = (e: RenderMouseEvent) => {
      if (e.button !== MouseEventButton.Main) return;
      if (e.target instanceof Artboard || e.target instanceof RootNode) {
        // TODO:
        canvasStore.selectedElements.clear();
        return;
      } else {
        if (!e.target) return;
        const target = e.target as SceneNode & IGRenderElement;
        if (e.shiftKey) {
          if (canvasStore.selectedElements.has(target)) {
            canvasStore.selectedElements.delete(target);
          } else {
            canvasStore.selectedElements.add(target);
          }
        } else {
          if (!canvasStore.selectedElements.has(target)) {
            canvasStore.selectedElements.clear();
            canvasStore.selectedElements.add(target);
          }
        }
      }
    };
    canvasStore.gRender?.rootNode.addEventListener(
      "mousedown",
      handleMousedown
    );
    return () => {
      canvasStore.gRender?.rootNode.removeEventListener(
        "mousedown",
        handleMousedown
      );
    };
  }, [canvasStore.gRender?.rootNode, canvasStore.selectedElements]);

  if (
    uiStore.selectedDesignTool !== DesignTool.Select ||
    !canvasMouseStore.isMainButtonDown ||
    (canvasMouseStore.isMouseDown && canvasStore.selectedElement)
  ) {
    return null;
  }

  const {
    mouseDownDomX,
    mouseDownDomY,
    currentMouseDomX,
    currentMouseDomY,
  } = canvasMouseStore;

  const left = Math.min(mouseDownDomX!, currentMouseDomX);
  const top = Math.min(mouseDownDomY!, currentMouseDomY);
  const width = Math.abs(mouseDownDomX! - currentMouseDomX);
  const height = Math.abs(mouseDownDomY! - currentMouseDomY);

  return (
    <Root
      style={{
        left,
        top,
        width,
        height,
      }}
    ></Root>
  );
};

export default observer(Selection);
