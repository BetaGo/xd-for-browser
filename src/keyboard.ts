import keyboardJS from "keyboardjs";
import { runInAction } from "mobx";

import { DesignTool, OtherTool } from "./constants";
import { globalStores } from "./contexts";

export function listenKeyboardEvents() {
  keyboardJS.bind("v", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Select;
    });
  });

  keyboardJS.bind("r", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Rectangle;
    });
  });

  keyboardJS.bind("e", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Ellipse;
    });
  });

  keyboardJS.bind("y", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Polygon;
    });
  });

  keyboardJS.bind("l", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Line;
    });
  });

  keyboardJS.bind("p", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Pen;
    });
  });

  keyboardJS.bind("t", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Text;
    });
  });

  keyboardJS.bind("a", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Artboard;
    });
  });

  keyboardJS.bind("z", () => {
    runInAction(() => {
      globalStores.uiStore.selectedDesignTool = DesignTool.Zoom;
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
    alert("c + n");
    console.log("ctrl + n");
    // window.open(window.location.origin);
  });

  keyboardJS.bind("ctrl + o", (e) => {
    e?.preventDefault();
    alert("c + o");
    runInAction(() => {
      globalStores.projectStore.loadXDFile();
    });
  });
}

export function stopListenKeyboardEvents() {
  keyboardJS.stop();
}
