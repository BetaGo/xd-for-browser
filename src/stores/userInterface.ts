import { makeAutoObservable } from "mobx";
import { DesignTool, OtherTool } from "../constants";

export class UserInterfaceStore {
  showMenuDrawer: boolean = false;

  showRenameModal: boolean = false;

  selectedDesignTool: DesignTool = DesignTool.Select;
  selectedOtherTool?: OtherTool;

  constructor() {
    makeAutoObservable(this);
  }
}
