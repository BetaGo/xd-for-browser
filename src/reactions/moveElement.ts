import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Matrix } from "../xd/scenegraph/matrix";
import { SceneNode } from "../xd/scenegraph/sceneNode";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

let transformList: Matrix[] = [];
let transformMap: WeakMap<Matrix, SceneNode> = new WeakMap();

reaction(
  () => {
    return {
      selectedDesignTool: uiStore.selectedDesignTool,
      selectedElements: canvasStore.selectedElements,
      mouseDownX: canvasMouseStore.mouseDownX,
      mouseDownY: canvasMouseStore.mouseDownY,
      currentMouseX: canvasMouseStore.currentMouseX,
      currentMouseY: canvasMouseStore.currentMouseY,
      isMainButtonDown: canvasMouseStore.isMainButtonDown,
    };
  },
  (d) => {
    // TODO: update selectedElement's parent after move

    if (
      d.selectedDesignTool !== DesignTool.Select ||
      !d.selectedElements.size ||
      !d.isMainButtonDown
    ) {
      transformList.forEach((v) => {
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
        let transformSnapShort = v.transform.clone();
        transformMap.set(transformSnapShort, v);
        return transformSnapShort;
      });
    }

    if (
      Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
      Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
    ) {
      transformList.forEach((transform) => {
        const dx = mouseDownX! - transform.e;
        const dy = mouseDownY! - transform.f;

        const targetX = currentMouseX - dx;
        const targetY = currentMouseY - dy;
        const currentElement = transformMap.get(transform);
        if (currentElement) {
          currentElement.transform.e = targetX;
          currentElement.transform.f = targetY;
        }
      });

      canvasStore.render();
    }
  }
);
