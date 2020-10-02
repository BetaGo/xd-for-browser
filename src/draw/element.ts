import EventEmitter from "eventemitter3";
import { IElementEventMap } from "./events";
import { GRender } from "./gRender";
import { IPoint } from "./utils";

export abstract class Element {
  style: any;
  transform: any;
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

  abstract show(): void;
  abstract hidden(): void;
  abstract isInnerPoint(point: IPoint): boolean;
}
