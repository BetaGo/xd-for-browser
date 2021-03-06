import { makeAutoObservable } from "mobx";

import { MouseEventButton } from "../constants";

export class CanvasMouseStore {
  containerDomElement?: HTMLElement;

  mouseButton?: MouseEventButton;
  isMouseDown: boolean = false;
  isMouseMoving: boolean = false;

  mouseDownX?: number;
  mouseDownY?: number;
  mouseDownDomX?: number;
  mouseDownDomY?: number;

  currentMouseX: number = 0;
  currentMouseY: number = 0;
  currentMouseDomX: number = 0;
  currentMouseDomY: number = 0;

  mouseUpX?: number;
  mouseUpY?: number;
  mouseUpDomX?: number;
  mouseUpDomY?: number;

  get isMainButtonDown() {
    return this.mouseButton === MouseEventButton.Main && this.isMouseDown;
  }

  get isSecondaryButtonDown() {
    return this.mouseButton === MouseEventButton.Secondary && this.isMouseDown;
  }

  get isAuxiliaryButtonDown() {
    return this.mouseButton === MouseEventButton.Auxiliary && this.isMouseDown;
  }

  constructor() {
    makeAutoObservable(this);
  }

  update(params: Partial<CanvasMouseStore>) {
    Object.assign(this, params);
  }
}
