import { Element } from "./element";

export interface IGRenderEvent {
  type: string;
}

export interface IGRenderElementMouseEvent extends IGRenderEvent {
  target?: Element;
  browserMouseEvent: MouseEvent;
}

export interface IGRenderResizeEvent extends IGRenderEvent {
  target?: HTMLCanvasElement;
}

export interface IElementEventMap {
  click: IGRenderElementMouseEvent;
  mousedown: IGRenderElementMouseEvent;
  mouseup: IGRenderElementMouseEvent;
  mousemove: IGRenderElementMouseEvent;
}

export interface IGRenderEventMap {
  click: IGRenderElementMouseEvent;
  mousedown: IGRenderElementMouseEvent;
  mouseup: IGRenderElementMouseEvent;
  mousemove: IGRenderElementMouseEvent;
  resize: IGRenderResizeEvent;
}
