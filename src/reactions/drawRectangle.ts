import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Rectangle } from "../draw/elements/rectangle";
import { IPoint } from "../draw/utils";
import { Color } from "../xd/scenegraph/color";

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
        // if (creatingRect.parent instanceof Pasteboard) {
        //   const endPoint: IPoint = {
        //     x: creatingRect.transform.e,
        //     y: creatingRect.transform.f,
        //   };
        //   const startPoint: IPoint = {
        //     x: creatingRect.transform.e + creatingRect.width,
        //     y: creatingRect.transform.f + creatingRect.height,
        //   };
        //   for (let artboard of canvasStore.artboards) {
        //     if (
        //       artboard.isInnerPoint(startPoint) ||
        //       artboard.isInnerPoint(endPoint)
        //     ) {
        //       creatingRect.removeFromParent();
        //       artboard.addChild(creatingRect);
        //       return;
        //     }
        //   }
        // }
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
      creatingRect = new Rectangle();
      creatingRect.width = width;
      creatingRect.height = height;
      creatingRect.fill = new Color("#fff");
      creatingRect.stroke = new Color("#707070");
      creatingRect.transform.e = x;
      creatingRect.transform.f = y;
      // canvasStore.selectedElement = creatingRect;

      const startPoint: IPoint = { x: mouseDownX!, y: mouseDownY! };
      for (let artboard of canvasStore.artboards) {
        if (artboard.isInnerPoint(startPoint)) {
          artboard.addChild(creatingRect);
          return;
        }
      }
      canvasStore.gRender?.rootNode?.addChild(creatingRect);
      console.log(creatingRect);
    } else {
      // creatingRect.updateTransform({
      //   tx: x,
      //   ty: y,
      // });
      creatingRect.transform.e = x;
      creatingRect.transform.f = y;
      creatingRect.width = width;
      creatingRect.height = height;
    }
    console.log("!!", creatingRect);
    canvasStore.render();
  }
);
