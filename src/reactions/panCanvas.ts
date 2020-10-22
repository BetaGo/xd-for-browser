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
      mouseDownDomX: canvasMouseStore.mouseDownDomX,
      mouseDownDomY: canvasMouseStore.mouseDownDomY,
      currentMouseDomX: canvasMouseStore.currentMouseDomX,
      currentMouseDomY: canvasMouseStore.currentMouseDomY,
      isMouseDown: canvasMouseStore.isMouseDown,
    };
  },
  (d) => {
    if (d.mouseButton !== MouseEventButton.Auxiliary || !d.isMouseDown) {
      transform = null;
      return;
    }
    if (!canvasStore.gRender?.transform) return;
    const {
      mouseDownDomX,
      mouseDownDomY,
      currentMouseDomX,
      currentMouseDomY,
    } = d;

    if (!transform) {
      transform = canvasStore.gRender.transform.clone();
    }

    const deltaX = currentMouseDomX - mouseDownDomX!;
    const deltaY = currentMouseDomY - mouseDownDomY!;
    const dpr = canvasStore.gRender.dpr;
    const tx = deltaX * dpr + transform.e;
    const ty = deltaY * dpr + transform.f;

    canvasStore.gRender.transform.e = tx;
    canvasStore.gRender.transform.f = ty;

    canvasStore.render();
  }
);
