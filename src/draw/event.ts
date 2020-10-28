import EventEmitter from "eventemitter3";
import _ from "lodash";
import { MouseEventButton } from "../constants";

type Constructor<T = {}> = new (...args: any[]) => T;

export class RenderEvent {
  constructor(public type: string) {}

  get stoppedPropagation(): boolean {
    return this._stoppedPropagation;
  }

  target: IRenderEventTarget | null = null;
  currentTarget: IRenderEventTarget | null = null;
  path: Array<IRenderEventTarget> = [];

  private _stoppedPropagation: boolean = false;

  stopPropagation() {
    this._stoppedPropagation = true;
  }

  clone() {
    return _.cloneDeep(this);
  }
}

export class RenderMouseEvent extends RenderEvent {
  button: MouseEventButton = MouseEventButton.Main;
  altKey: boolean = false;
  ctrlKey: boolean = false;
  metaKey: boolean = false;
  shiftKey: boolean = false;
}

export interface RenderEventListener {
  (evt: RenderEvent): void;
}

export type RenderEventMode = "capture" | "bubble" | "all";

export interface IRenderEventTarget {
  addEventListener<K extends keyof IRenderEventMap>(
    type: K,
    listener: (evt: IRenderEventMap[K]) => void,
    useCapture?: boolean
  ): void;
  removeEventListener<K extends keyof IRenderEventMap>(
    type: K,
    listener: (evt: IRenderEventMap[K]) => void,
    useCapture?: boolean
  ): void;
  dispatchEvent(evt: RenderEvent, mode?: RenderEventMode): void;
}

export function MixinRenderEventTarget<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    #captureEE = new EventEmitter();
    #bubbleEE = new EventEmitter();
    addEventListener<K extends keyof IRenderEventMap>(
      type: K,
      listener: (evt: IRenderEventMap[K]) => void,
      useCapture: boolean = false
    ) {
      if (useCapture) {
        this.#captureEE.addListener(type, listener);
      } else {
        this.#bubbleEE.addListener(type, listener);
      }
    }

    dispatchEvent(evt: RenderEvent, mode: RenderEventMode = "all") {
      if (mode === "capture" || mode === "all") {
        this.#captureEE.emit(evt.type, evt);
      }
      if (mode === "bubble" || mode === "all") {
        this.#bubbleEE.emit(evt.type, evt);
      }
    }

    removeEventListener<K extends keyof IRenderEventMap>(
      type: K,
      callback: (evt: IRenderEventMap[K]) => void,
      useCapture: boolean = false
    ) {
      if (useCapture) {
        this.#captureEE.removeListener(type, callback);
      } else {
        this.#bubbleEE.removeListener(type, callback);
      }
    }
  };
}

export interface IRenderEventMap {
  click: RenderMouseEvent;
  mousedown: RenderMouseEvent;
  mousemove: RenderMouseEvent;
}
