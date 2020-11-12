import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Matrix } from "../xd/scenegraph/matrix";
import { SceneNode } from "../xd/scenegraph/sceneNode";
import { afterBoundsChange } from "./helpers/afterNodeBoundsChange";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createMoveElementsReaction = () => {
  let transformList: Matrix[] = [];
  let transformMap: WeakMap<Matrix, SceneNode> = new WeakMap();
  return reaction(
    () => {
      return {
        selectedDesignTool: uiStore.selectedDesignTool,
        selectedElements: canvasStore.selection.items,
        mouseDownX: canvasMouseStore.mouseDownX,
        mouseDownY: canvasMouseStore.mouseDownY,
        currentMouseX: canvasMouseStore.currentMouseX,
        currentMouseY: canvasMouseStore.currentMouseY,
        isMainButtonDown: canvasMouseStore.isMainButtonDown,
      };
    },
    (d) => {
      if (
        d.selectedDesignTool !== DesignTool.Select ||
        !d.selectedElements.length ||
        !d.isMainButtonDown ||
        uiStore.selectionRect.show
      ) {
        if (!transformList.length) {
          return;
        }
        transformList.forEach((v) => {
          const current = transformMap.get(v);
          if (!current) {
            return;
          }
          afterBoundsChange(current);
          transformMap.delete(v);
        });
        transformList = [];
        return;
      }

      const {
        mouseDownX,
        mouseDownY,
        currentMouseX,
        currentMouseY,
        selectedElements,
      } = d;
      if (!transformList.length) {
        transformList = [...selectedElements].map((v) => {
          let transformSnapShort = v.globalTransform.clone();
          transformMap.set(transformSnapShort, v);
          return transformSnapShort;
        });
      }

      if (
        Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
        Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
      ) {
        transformList.forEach((transform) => {
          const currentElement = transformMap.get(transform);
          if (currentElement) {
            const dx = mouseDownX! - transform.e;
            const dy = mouseDownY! - transform.f;
            const targetX =
              currentMouseX - dx - (currentElement.parent?.transform.e ?? 0);
            const targetY =
              currentMouseY - dy - (currentElement.parent?.transform.f ?? 0);
            currentElement.transform.e = targetX;
            currentElement.transform.f = targetY;
          }
        });

        canvasStore.render();
      }
    }
  );
};
