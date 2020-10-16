import EventEmitter from "eventemitter3";

import { IElementEventMap } from "./events";
import { GRender } from "./gRender";
import { BoundingBox, IBoundingRect } from "./shape";
import { Style } from "./style";
import { Transform } from "./transform";
import { IPoint } from "./utils";

export abstract class Element {
  visible: boolean = true;
  style: Style = new Style();
  transform: Transform = new Transform();
  rotation: number = 0;
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

  updateTransform(property: Partial<Transform>) {
    Object.assign(this.transform, property);
    this.emit("boundingChange", { type: "boundingChange", target: this });
  }

  abstract name: string;
  abstract type: string;

  abstract render(): void;
  abstract isInnerPoint(point: IPoint): boolean;
  abstract toJSON(): any;
  abstract getBoundingBox(): BoundingBox;
  abstract setBounding<K extends keyof IBoundingRect>(
    key: K,
    value: IBoundingRect[K]
  ): void;
  abstract updatePosition(point: IPoint): void;

  /**
   *  rotate element
   * @param angle  (measured in radians)
   * @param center rotate center point; use element Bounding center by default.
   */
  abstract rotate(angle: number, center?: IPoint): void;

  /**
   * set element current rotate
   * @param angle (measured in radians)
   */
  abstract setRotate(angle: number): void;
}
