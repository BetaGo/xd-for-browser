import React from "react";

import { CanvasStore } from "./stores/canvas";
import { CanvasMouseStore } from "./stores/canvasMouse";
import { ProjectStore } from "./stores/project";
import { UserInterfaceStore } from "./stores/userInterface";

export const globalStores = {
  uiStore: new UserInterfaceStore(),
  projectStore: new ProjectStore(),
  canvasStore: new CanvasStore(),
  canvasMouseStore: new CanvasMouseStore(),
};

export const storesContext = React.createContext(globalStores);

// @ts-ignore
window.__MOBX_STORE__ = globalStores;
