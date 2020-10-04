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
      creatingRect = new Rectangle(x, y, width, height);
      creatingRect.style.fill.type = "solid";
      creatingRect.style.fill.setColor("#fff");
      creatingRect.style.stroke.setColor("#707070");
      creatingRect.style.stroke.type = "solid";
      creatingRect.on("click", (e) => {
        runInAction(() => {
          canvasStore.selectedElement = e.target;
        });
      });
      canvasStore.gRender?.add(creatingRect);
    } else {
      creatingRect.x = x;
      creatingRect.y = y;
      creatingRect.width = width;
      creatingRect.height = height;
    }
    canvasStore.render();
  }
);
