import { makeAutoObservable } from "mobx";
import { DesignTool, OtherTool } from "../constants";

export class UserInterfaceStore {
  showMenuDrawer: boolean = false;

  showRenameModal: boolean = false;

  selectedDesignTool: DesignTool = DesignTool.Select;
  selectedOtherTool?: OtherTool;

  selectionRect = {
    show: false,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }
}
