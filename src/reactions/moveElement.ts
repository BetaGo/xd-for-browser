import { reaction } from "mobx";

import { DesignTool, MouseEventButton } from "../constants";
import { globalStores } from "../contexts";
import { BoundingBox } from "../draw/shape";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

let elementBoundingBox: BoundingBox | null = null;

reaction(
  () => {
    return {
      selectedDesignTool: uiStore.selectedDesignTool,
      selectedElement: canvasStore.selectedElement,
      mouseButton: canvasMouseStore.mouseButton,
      mouseDownX: canvasMouseStore.mouseDownX,
      mouseDownY: canvasMouseStore.mouseDownY,
      currentMouseX: canvasMouseStore.currentMouseX,
      currentMouseY: canvasMouseStore.currentMouseY,
      isMouseDown: canvasMouseStore.isMouseDown,
    };
  },
  (d) => {
    if (
      d.selectedDesignTool !== DesignTool.Select ||
      !d.isMouseDown ||
      !d.selectedElement ||
      d.mouseButton !== MouseEventButton.Main
    ) {
      elementBoundingBox = null;
      return;
    }

    const {
      mouseDownX,
      mouseDownY,
      currentMouseX,
      currentMouseY,
      selectedElement,
    } = d;
    if (!elementBoundingBox) {
      elementBoundingBox = selectedElement.getBoundingBox();
    }

    if (
      Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
      Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
    ) {
      const dx = mouseDownX! - elementBoundingBox.transform.tx;
      const dy = mouseDownY! - elementBoundingBox.transform.ty;

      const targetX = currentMouseX - dx;
      const targetY = currentMouseY - dy;

      selectedElement.updateTransform({
        tx: targetX,
        ty: targetY,
      });

      canvasStore.render();
    }
  }
);
