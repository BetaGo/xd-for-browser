import keyboardJS from "keyboardjs";
import { runInAction } from "mobx";

import { DesignTool, OtherTool } from "./constants";
import { globalStores } from "./contexts";

export function listenKeyboardEvents() {
  keyboardJS.bind("v", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Select;
    });
  });

  keyboardJS.bind("r", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    console.log(e);
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Rectangle;
    });
  });

  keyboardJS.bind("e", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Ellipse;
    });
  });

  keyboardJS.bind("y", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Polygon;
    });
  });

  keyboardJS.bind("l", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Line;
    });
  });

  keyboardJS.bind("p", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Pen;
    });
  });

  keyboardJS.bind("t", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Text;
    });
  });

  keyboardJS.bind("a", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Artboard;
    });
  });

  keyboardJS.bind("z", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Zoom;
    });
  });

  keyboardJS.bind("backspace", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.canvasStore.selection.items.forEach((item) => {
        item.removeFromParent();
      });
      globalStores.canvasStore.selection.items = [];
      globalStores.canvasStore.render();
    });
  });

  keyboardJS.bind("delete", (e: any) => {
    if (e?.target?.tagName?.toUpperCase() === "INPUT") return;
    runInAction(() => {
      globalStores.canvasStore.selection.items.forEach((item) => {
        item.removeFromParent();
      });
      globalStores.canvasStore.selection.items = [];
      globalStores.canvasStore.render();
    });
  });

  keyboardJS.bind("ctrl + shift + y", (e) => {
    e?.preventDefault();
    runInAction(() => {
      globalStores.uiStore.selectedOtherTool =
        globalStores.uiStore.selectedOtherTool === OtherTool.Assets
          ? undefined
          : OtherTool.Assets;
    });
  });

  keyboardJS.bind("ctrl + y", (e) => {
    e?.preventDefault();
    runInAction(() => {
      globalStores.uiStore.selectedOtherTool =
        globalStores.uiStore.selectedOtherTool === OtherTool.Layers
          ? undefined
          : OtherTool.Layers;
    });
  });

  keyboardJS.bind("ctrl + n", (e) => {
    e?.preventDefault();
    window.open(window.location.origin);
  });

  keyboardJS.bind("ctrl + o", (e) => {
    e?.preventDefault();
    runInAction(() => {
      globalStores.projectStore.loadXDFile();
    });
  });
}

export function stopListenKeyboardEvents() {
  keyboardJS.stop();
}
