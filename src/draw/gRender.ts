import EventEmitter from "eventemitter3";
import ResizeObserver from "resize-observer-polyfill";

import { MouseEventButton } from "../constants";
import { createIdentityMatrix, Matrix } from "../xd/scenegraph/matrix";
import { Element } from "./element";
import { IGRenderElement } from "./elements/interface";
import { RootNode } from "./elements/rootNode";
import { RenderMouseEvent } from "./event";
import { IGRenderEventMap } from "./events";
import { IPoint, setupCanvas } from "./utils";

export class GRender {
  static init(container: HTMLElement) {
    return new GRender(container);
  }
  static MAX_ZOOM_VALUE = 64;
  static MIN_ZOOM_VALUE = 0.025;

  containerElement: HTMLElement;
  canvasElement: HTMLCanvasElement;
  canvasCtx2D: CanvasRenderingContext2D;
  rootNode = new RootNode();
  eventEmitter = new EventEmitter();
  transform: Matrix;
  zoomValue = 1;

  private canvasResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === this.canvasElement) {
        this.resizeCanvas();
        this.eventEmitter.emit("resize", {
          type: "resize",
          target: this.canvasElement,
        });
      }
    }
  });

  readonly dpr: number;

  private MouseDownButton: MouseEventButton | null = null;
  private MouseDownPoint: IPoint | null = null;

  constructor(container: HTMLElement) {
    this.containerElement = container;

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.setAttribute(
      "style",
      `display: block; width: 100%; height: 100%`
    );
    this.containerElement.appendChild(this.canvasElement);
    this.dpr = window.devicePixelRatio || 1;
    const rect = this.canvasElement.getBoundingClientRect();
    this.canvasElement.width = rect.width * this.dpr;
    this.canvasElement.height = rect.height * this.dpr;
    this.canvasCtx2D = this.canvasElement.getContext("2d")!;

    this.transform = createIdentityMatrix();
    this.transform.a = this.dpr;
    this.transform.d = this.dpr;

    this.resizeCanvas();

    // canvas DOM 事件监听
    this.listenCanvasDomEvents();

    // resize 事件监听
    this.canvasResizeObserver.observe(this.canvasElement);
  }

  translate(tx: number, ty: number) {
    const x = tx * this.dpr;
    const y = ty * this.dpr;
    this.transform.translate(x, y);
  }

  scale(value: number, center?: IPoint) {
    if (center) {
      this.transform.scale(value, value, center.x, center.y);
    } else {
      this.transform.scale(value);
    }
  }

  zoom(value: number, center?: IPoint) {
    const v = Math.min(
      Math.max(value, GRender.MIN_ZOOM_VALUE),
      GRender.MAX_ZOOM_VALUE
    );
    const scaleValue = v / this.zoomValue;
    if (center) {
      center.x = center.x * this.dpr - (this.transform.e ?? 0);
      center.y = center.y * this.dpr - (this.transform.f ?? 0);
    }
    this.scale(scaleValue, center);
    this.zoomValue = v;
  }

  resizeCanvas() {
    this.canvasCtx2D = setupCanvas(this.canvasElement)!;
  }

  render() {
    const rect = this.canvasElement.getBoundingClientRect();

    this.canvasCtx2D.setTransform(
      this.transform.a,
      this.transform.b,
      this.transform.c,
      this.transform.d,
      this.transform.e,
      this.transform.f
    );

    this.canvasCtx2D.save();
    this.canvasCtx2D.resetTransform();
    this.canvasCtx2D.clearRect(
      0,
      0,
      rect.width * this.dpr,
      rect.height * this.dpr
    );
    this.canvasCtx2D.restore();
    this.rootNode?.render(this);
  }

  add(element: any) {
    //TODO:
  }

  remove(element: any) {
    // TODO:
  }

  on<K extends keyof IGRenderEventMap>(
    type: K,
    listener: (ev: IGRenderEventMap[K]) => void
  ): void {
    this.eventEmitter.on(type, listener);
  }

  off<K extends keyof IGRenderEventMap>(
    type: K,
    listener: (ev: IGRenderEventMap[K]) => void
  ): void {
    this.eventEmitter.off(type, listener);
  }

  getElementFromPoint(point: IPoint): Element | undefined {
    // TODO:
    return;
  }

  getCanvasPointFromEvent = (e: MouseEvent) => {
    const rect = this.canvasElement.getBoundingClientRect();
    const domX = e.clientX - rect.x;
    const tx = this.transform.e ?? 0;
    const domY = e.clientY - rect.y;
    const ty = this.transform.f ?? 0;
    const x = (domX - tx / this.dpr) / this.zoomValue;
    const y = (domY - ty / this.dpr) / this.zoomValue;
    return { domX, domY, x, y };
  };

  listenCanvasDomEvents() {
    const mouseEventList: Array<
      keyof Pick<
        HTMLElementEventMap,
        "click" | "mousedown" | "mouseup" | "mousemove"
      >
    > = ["click", "mousedown", "mouseup", "mousemove"];
    mouseEventList.forEach((eventType) => {
      this.canvasElement.addEventListener(eventType, (e) => {
        let point: IPoint = this.getCanvasPointFromEvent(e);
        const path: IGRenderElement[] = [];
        let captureQueue: IGRenderElement[] = [this.rootNode];

        while (captureQueue.length) {
          const current = captureQueue.shift();
          if (current?.isInnerPoint(point)) {
            path.push(current);
            captureQueue = current.children.slice().reverse();
          }
        }

        path.reverse();

        let evt = new RenderMouseEvent(eventType);
        evt.target = path[0];
        evt.path = path;
        evt.button = e.button;
        evt.altKey = e.altKey;
        evt.ctrlKey = e.ctrlKey;
        evt.metaKey = e.metaKey;
        evt.shiftKey = e.shiftKey;
        // capture
        for (let i = path.length - 1; i >= 0; i--) {
          if (evt.stoppedPropagation) return;
          const current = path[i];
          evt.currentTarget = current;
          current.dispatchEvent(evt, "capture");
        }

        // bubble
        for (let i = 0; i < path.length; i++) {
          if (evt.stoppedPropagation) return;
          const current = path[i];
          evt.currentTarget = current;
          current.dispatchEvent(evt, "bubble");
        }
      });
    });
  }
}
