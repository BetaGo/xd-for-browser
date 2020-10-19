import { reaction } from "mobx";

import { MouseEventButton } from "../constants";
import { globalStores } from "../contexts";
import { Matrix } from "../xd/scenegraph/matrix";

const { canvasStore, canvasMouseStore } = globalStores;

let transform: Matrix | null = null;

reaction(
  () => {
    return {
      mouseButton: canvasMouseStore.mouseButton,
      mouseDownX: canvasMouseStore.mouseDownX,
      mouseDownY: canvasMouseStore.mouseDownY,
      currentMouseX: canvasMouseStore.currentMouseX,
      currentMouseY: canvasMouseStore.currentMouseY,
      isMouseDown: canvasMouseStore.isMouseDown,
    };
  },
  (d) => {
    if (d.mouseButton !== MouseEventButton.Auxiliary || !d.isMouseDown) {
      transform = null;
      return;
    }
    if (!canvasStore.gRender?.transform) return;
    const { mouseDownX, mouseDownY, currentMouseX, currentMouseY } = d;

    if (!transform) {
      transform = canvasStore.gRender.transform.clone();
    }

    const deltaX = currentMouseX - mouseDownX!;
    const deltaY = currentMouseY - mouseDownY!;
    const dpr = canvasStore.gRender.dpr;
    const tx = deltaX * dpr + transform.e;
    const ty = deltaY * dpr + transform.f;

    canvasStore.gRender.transform.e = tx;
    canvasStore.gRender.transform.f = ty;

    canvasStore.render();
  }
);
