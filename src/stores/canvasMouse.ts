import { makeAutoObservable } from "mobx";

export class CanvasMouseStore {
  isMouseDown: boolean = false;
  mouseDownX?: number;
  mouseDownY?: number;

  currentMouseX: number = 0;
  currentMouseY: number = 0;

  isMouseUp: boolean = true;
  mouseUpX?: number;
  mouseUpY?: number;

  constructor() {
    makeAutoObservable(this);
  }
}
