import EventEmitter from "eventemitter3";

import { IElementEventMap } from "./events";
import { GRender } from "./gRender";
import { BoundingBox } from "./shape";
import { Style } from "./style";
import { Transform } from "./transform";
import { IPoint } from "./utils";

export abstract class Element {
  visible: boolean = true;
  style: Style = new Style();
  transform: Transform = new Transform();
  gRender?: GRender;
  eventEmitter = new EventEmitter();

  on<K extends keyof IElementEventMap>(
    type: K,
    listener: (ev: IElementEventMap[K]) => void
  ): void {
    this.eventEmitter.on(type, listener);
  }

  off<K extends keyof IElementEventMap>(
    type: K,
    listener: (ev: IElementEventMap[K]) => void
  ): void {
    this.eventEmitter.off(type, listener);
  }

  emit<K extends keyof IElementEventMap>(
    type: K,
    data: IElementEventMap[K]
  ): void {
    this.eventEmitter.emit(type, data);
  }

  remove() {
    this.eventEmitter.removeAllListeners();
    this.gRender?.remove(this);
  }

  show() {
    this.visible = true;
  }

  hide() {
    this.visible = false;
  }

  abstract name: string;
  abstract type: string;

  abstract update<T>(params: T): void;
  abstract render(): void;
  abstract isInnerPoint(point: IPoint): boolean;
  abstract toJSON(): any;
  abstract getBoundingBox(): BoundingBox;
  abstract updatePosition(point: IPoint): void;
}
