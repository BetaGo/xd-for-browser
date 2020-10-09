import { reaction, runInAction } from "mobx";
import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Rectangle } from "../draw/shape";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

let creatingRect: Rectangle | null = null;

reaction(
  () => {
    return {
      selectedDesignTool: uiStore.selectedDesignTool,
      ...canvasMouseStore,
    };
  },
  (d) => {
    if (d.selectedDesignTool !== DesignTool.Rectangle || !d.isMouseDown) {
      if (creatingRect) {
        creatingRect = null;
      }
      return;
    }

    const { mouseDownX, mouseDownY, currentMouseX, currentMouseY } = d;

    const x = Math.min(mouseDownX!, currentMouseX);
    const y = Math.min(mouseDownY!, currentMouseY);
    const width = Math.abs(mouseDownX! - currentMouseX);
    const height = Math.abs(mouseDownY! - currentMouseY);

    if (!creatingRect) {
      creatingRect = new Rectangle(0, 0, width, height);

      creatingRect.style.fill.type = "solid";
      creatingRect.style.fill.setColor("#fff");
      creatingRect.style.stroke.setColor("#707070");
      creatingRect.style.stroke.type = "solid";
      creatingRect.transform.tx = x;
      creatingRect.transform.ty = y;
      canvasStore.gRender?.add(creatingRect);
      canvasStore.selectedElement = creatingRect;
    } else {
      creatingRect.updateTransform({
        tx: x,
        ty: y,
      });
      creatingRect.width = width;
      creatingRect.height = height;
    }
    canvasStore.render();
  }
);
