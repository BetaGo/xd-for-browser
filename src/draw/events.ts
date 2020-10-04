import { Element } from "./element";

export interface IGRenderEvent {
  type: string;
}

export interface IGRenderElementMouseEvent extends IGRenderEvent {
  target?: Element;
}

export interface IGRenderResizeEvent extends IGRenderEvent {
  target?: HTMLCanvasElement;
}

export interface IElementEventMap {
  click: IGRenderElementMouseEvent;
}

export interface IGRenderEventMap {
  click: IGRenderElementMouseEvent;
  resize: IGRenderResizeEvent;
}
