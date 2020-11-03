import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Rectangle } from "../draw/elements/rectangle";
import { RootNode } from "../draw/elements/rootNode";
import { Point } from "../utils/geometry";
import { Color } from "../xd/scenegraph/color";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createDrawRectReaction = () => {
  let creatingRect: Rectangle | null = null;
  return reaction(
    () => {
      return {
        selectedDesignTool: uiStore.selectedDesignTool,
        mouseDownX: canvasMouseStore.mouseDownX,
        mouseDownY: canvasMouseStore.mouseDownY,
        currentMouseX: canvasMouseStore.currentMouseX,
        currentMouseY: canvasMouseStore.currentMouseY,
        isMainButtonDown: canvasMouseStore.isMainButtonDown,
      };
    },
    (d) => {
      if (
        d.selectedDesignTool !== DesignTool.Rectangle ||
        !d.isMainButtonDown
      ) {
        if (creatingRect) {
          if (creatingRect.parent instanceof RootNode) {
            const endPoint: Point = {
              x: creatingRect.transform.e,
              y: creatingRect.transform.f,
            };
            const startPoint: Point = {
              x: creatingRect.transform.e + creatingRect.width,
              y: creatingRect.transform.f + creatingRect.height,
            };
            for (let artboard of canvasStore.artboards) {
              if (
                artboard.isInnerPoint(startPoint) ||
                artboard.isInnerPoint(endPoint)
              ) {
                creatingRect.removeFromParent();
                artboard.addChild(creatingRect);
                return;
              }
            }
          }
          creatingRect = null;
        }
        return;
      }

      const { mouseDownX, mouseDownY, currentMouseX, currentMouseY } = d;

      const x = Math.min(mouseDownX!, currentMouseX);
      const y = Math.min(mouseDownY!, currentMouseY);
      const width = Math.abs(mouseDownX! - currentMouseX);
      const height = Math.abs(mouseDownY! - currentMouseY);

      if (width < 1 || height < 1) {
        return;
      }

      if (!creatingRect) {
        creatingRect = new Rectangle();
        creatingRect.width = width;
        creatingRect.height = height;
        creatingRect.fill = new Color("#fff");
        creatingRect.stroke = new Color("#707070");
        creatingRect.transform.e = x;
        creatingRect.transform.f = y;

        const startPoint: Point = { x: mouseDownX!, y: mouseDownY! };
        canvasStore.gRender?.rootNode?.addChild(creatingRect);
        for (let artboard of canvasStore.artboards) {
          if (artboard.isInnerPoint(startPoint)) {
            creatingRect.removeFromParent();
            artboard.addChild(creatingRect);
            break;
          }
        }

        canvasStore.selection.items = [creatingRect];
      } else {
        creatingRect.transform.e = x;
        creatingRect.transform.f = y;
        creatingRect.width = width;
        creatingRect.height = height;
      }

      canvasStore.render();
    }
  );
};
