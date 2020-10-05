import { makeAutoObservable } from "mobx";

import { MouseEventButton } from "../constants";

export class CanvasMouseStore {
  mouseButton?: MouseEventButton;
  isMouseDown: boolean = false;
  isMouseMoving: boolean = false;

  mouseDownX?: number;
  mouseDownY?: number;

  currentMouseX: number = 0;
  currentMouseY: number = 0;

  mouseUpX?: number;
  mouseUpY?: number;

  constructor() {
    makeAutoObservable(this);
  }

  update(params: Partial<CanvasMouseStore>) {
    Object.assign(this, params);
  }
}
