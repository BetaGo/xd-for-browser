import { reaction } from "mobx";

import { DesignTool, MouseEventButton } from "../constants";
import { globalStores } from "../contexts";
import { IBoundingRect } from "../draw/element";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

let elementRect: IBoundingRect | null = null;

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
      elementRect = null;
      return;
    }

    const {
      mouseDownX,
      mouseDownY,
      currentMouseX,
      currentMouseY,
      selectedElement,
    } = d;
    if (!elementRect) {
      elementRect = selectedElement.getBoundingRect();
    }

    const dx = mouseDownX! - elementRect.x;
    const dy = mouseDownY! - elementRect.y;

    const targetX = currentMouseX - dx;
    const targetY = currentMouseY - dy;

    selectedElement.updatePosition({
      x: targetX,
      y: targetY,
    });

    canvasStore.render();
  }
);
