import { makeAutoObservable } from "mobx";

export class UserInterfaceStore {
  showMenuDrawer: boolean = false;

  showRenameModal: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }
}
