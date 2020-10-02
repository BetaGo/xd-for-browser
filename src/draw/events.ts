import { Element } from "./element";

export interface IGRenderEvent {
  type: string;
}

export interface IGRenderElementMouseEvent extends IGRenderEvent {
  target: Element;
}

export interface IElementEventMap {
  click: IGRenderElementMouseEvent;
}
