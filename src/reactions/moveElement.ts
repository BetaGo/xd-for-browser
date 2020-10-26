import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Matrix } from "../xd/scenegraph/matrix";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

let transform: Matrix | null = null;

reaction(
  () => {
    return {
      selectedDesignTool: uiStore.selectedDesignTool,
      selectedElement: canvasStore.selectedElement,
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
      !d.selectedElement ||
      !d.isMainButtonDown
    ) {
      transform = null;
      return;
    }

    const {
      mouseDownX,
      mouseDownY,
      currentMouseX,
      currentMouseY,
      selectedElement,
    } = d;
    if (!transform) {
      transform = selectedElement.transform.clone();
    }

    if (
      Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
      Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
    ) {
      const dx = mouseDownX! - transform.e;
      const dy = mouseDownY! - transform.f;

      const targetX = currentMouseX - dx;
      const targetY = currentMouseY - dy;

      selectedElement.transform.e = targetX;
      selectedElement.transform.f = targetY;

      canvasStore.render();
    }
  }
);
