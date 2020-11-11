import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Ellipse } from "../draw/elements/ellipse";
import { RootNode } from "../draw/elements/rootNode";
import { Point } from "../utils/geometry";
import { Color } from "../xd/scenegraph/color";
import { moveNode } from "../xd/sceneNode.helpers";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createDrawEllipseReaction = () => {
  let creatingEllipse: Ellipse | null = null;
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
      if (d.selectedDesignTool !== DesignTool.Ellipse || !d.isMainButtonDown) {
        if (creatingEllipse) {
          if (creatingEllipse.parent instanceof RootNode) {
            const endPoint: Point = {
              x: creatingEllipse.globalTransform.e,
              y: creatingEllipse.globalTransform.f,
            };
            const startPoint: Point = {
              x:
                creatingEllipse.globalTransform.e + creatingEllipse.radiusX * 2,
              y:
                creatingEllipse.globalTransform.f + creatingEllipse.radiusY * 2,
            };
            // TODO: 改用碰撞检测
            for (let artboard of canvasStore.artboards) {
              if (
                artboard.isInnerPoint(startPoint) ||
                artboard.isInnerPoint(endPoint)
              ) {
                moveNode(creatingEllipse, artboard);
                return;
              }
            }
          }
          creatingEllipse = null;
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

      if (!creatingEllipse) {
        creatingEllipse = new Ellipse();
        creatingEllipse.radiusX = width / 2;
        creatingEllipse.radiusY = height / 2;
        creatingEllipse.fill = new Color("#fff");
        creatingEllipse.stroke = new Color("#707070");

        const startPoint: Point = { x: mouseDownX!, y: mouseDownY! };
        canvasStore.gRender?.rootNode?.addChild(creatingEllipse);
        for (let artboard of canvasStore.artboards) {
          if (artboard.isInnerPoint(startPoint)) {
            creatingEllipse.removeFromParent();
            artboard.addChild(creatingEllipse);
            break;
          }
        }
        creatingEllipse.transform.e =
          x - (creatingEllipse.parent?.globalTransform.e ?? 0);
        creatingEllipse.transform.f =
          y - (creatingEllipse.parent?.globalTransform.f ?? 0);

        canvasStore.selection.items = [creatingEllipse];
      } else {
        creatingEllipse.transform.e =
          x - (creatingEllipse.parent?.globalTransform.e ?? 0);
        creatingEllipse.transform.f =
          y - (creatingEllipse.parent?.globalTransform.f ?? 0);
        creatingEllipse.radiusX = width / 2;
        creatingEllipse.radiusY = height / 2;
      }

      canvasStore.render();
    }
  );
};
