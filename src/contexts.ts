import React from "react";

import { ProjectStore } from "./stores/project";
import { UserInterfaceStore } from "./stores/userInterface";

const globalStores = {
  uiStore: new UserInterfaceStore(),
  projectStore: new ProjectStore(),
};

export const storesContext = React.createContext(globalStores);
