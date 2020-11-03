import { reaction, runInAction } from "mobx";

import { DesignTool, MouseEventButton } from "../constants";
import { globalStores } from "../contexts";
import { Artboard } from "../draw/elements/artboard";
import { IGRenderElement } from "../draw/elements/interface";
import { RootNode } from "../draw/elements/rootNode";
import { IRenderEventTarget, RenderMouseEvent } from "../draw/event";
import { isRectOverlap, RectPoints } from "../utils/geometry";
import { SceneNode } from "../xd/scenegraph/sceneNode";
import { boundsToRectPoints } from "../xd/sceneNode.helpers";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createSelectElementsReaction = () => {
  let mousedownElement: IRenderEventTarget | null = null;

  const handleMousedown = (e: RenderMouseEvent) => {
    if (
      e.button !== MouseEventButton.Main ||
      uiStore.selectedDesignTool !== DesignTool.Select
    ) {
      return;
    }
    mousedownElement = e.target;
    runInAction(() => {
      const selectedElements = new Set(canvasStore.selection.items);
      if (e.target instanceof Artboard || e.target instanceof RootNode) {
        // TODO:
        selectedElements.forEach((e) => {
          e.selected = false;
        });
        selectedElements.clear();
      } else {
        if (!e.target) return;
        const target = e.target as SceneNode & IGRenderElement;
        if (e.shiftKey) {
          if (selectedElements.has(target)) {
            target.selected = false;
            selectedElements.delete(target);
          } else {
            target.selected = true;
            selectedElements.add(target);
          }
        } else {
          if (!selectedElements.has(target)) {
            selectedElements.clear();
            target.selected = true;
            selectedElements.add(target);
          }
        }
      }
      canvasStore.selection.items = [...selectedElements];
    });
  };

  canvasStore.gRender?.rootNode.addEventListener("mousedown", handleMousedown);

  const disposer = reaction(
    () => {
      return {
        selectedDesignTool: uiStore.selectedDesignTool,
        mouseDownX: canvasMouseStore.mouseDownX,
        mouseDownY: canvasMouseStore.mouseDownY,
        currentMouseX: canvasMouseStore.currentMouseX,
        currentMouseY: canvasMouseStore.currentMouseY,
        mouseDownDomX: canvasMouseStore.mouseDownDomX,
        mouseDownDomY: canvasMouseStore.mouseDownDomY,
        currentMouseDomX: canvasMouseStore.currentMouseDomX,
        currentMouseDomY: canvasMouseStore.currentMouseDomY,
        isMainButtonDown: canvasMouseStore.isMainButtonDown,
      };
    },
    (d) => {
      if (
        d.selectedDesignTool !== DesignTool.Select ||
        !d.isMainButtonDown ||
        !(
          mousedownElement instanceof RootNode ||
          mousedownElement instanceof Artboard
        )
      ) {
        uiStore.selectionRect.show = false;
      } else {
        const left = Math.min(d.mouseDownDomX!, d.currentMouseDomX);
        const top = Math.min(d.mouseDownDomY!, d.currentMouseDomY);
        const width = Math.abs(d.mouseDownDomX! - d.currentMouseDomX);
        const height = Math.abs(d.mouseDownDomY! - d.currentMouseDomY);
        uiStore.selectionRect = {
          show: true,
          left,
          top,
          width,
          height,
        };
      }
      if (uiStore.selectionRect.show) {
        const selectedElements: Set<SceneNode> = new Set();
        let list = [...canvasStore.gRender!.rootNode.children];
        const { mouseDownX, mouseDownY, currentMouseX, currentMouseY } = d;
        const selectionRectPath: RectPoints = [
          {
            x: mouseDownX!,
            y: mouseDownY!,
          },
          {
            x: currentMouseX,
            y: mouseDownY!,
          },
          {
            x: currentMouseX,
            y: currentMouseY,
          },
          {
            x: mouseDownX!,
            y: currentMouseY,
          },
        ];
        while (list.length) {
          const current = list.shift();
          if (!current) break;
          if (current instanceof Artboard) {
            list.push(...current.children);
          } else {
            const rectPath = boundsToRectPoints(
              current.globalBounds,
              current.rotation
            );
            if (isRectOverlap(rectPath, selectionRectPath)) {
              selectedElements.add(current);
            }
          }
        }
        canvasStore.selection.itemsIncludingLocked = [...selectedElements];
      }
    }
  );

  return () => {
    disposer();
    canvasStore.gRender?.rootNode.removeEventListener(
      "mousedown",
      handleMousedown
    );
  };
};
