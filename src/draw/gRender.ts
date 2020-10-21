import EventEmitter from "eventemitter3";
import ResizeObserver from "resize-observer-polyfill";

import { MouseEventButton } from "../constants";
import { createIdentityMatrix, Matrix } from "../xd/scenegraph/matrix";
import { Element } from "./element";
import { RootNode } from "./elements/rootNode";
import { IGRenderEventMap } from "./events";
import { IPoint, setupCanvas } from "./utils";

export class GRender {
  static init(container: HTMLElement) {
    return new GRender(container);
  }

  containerElement: HTMLElement;
  canvasElement: HTMLCanvasElement;
  canvasCtx2D: CanvasRenderingContext2D;
  rootNode: RootNode | null = null;
  eventEmitter = new EventEmitter();
  transform: Matrix;

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

  scale(value: number, center?: IPoint) {
    if (center) {
      this.transform.scale(
        value,
        value,
        center.x * this.dpr - this.transform.e,
        center.y * this.dpr - this.transform.f
      );
    } else {
      this.transform.scale(value);
    }
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

  listenCanvasDomEvents() {
    const mouseEventList: Array<
      keyof Pick<
        HTMLElementEventMap,
        "click" | "mousedown" | "mouseup" | "mousemove"
      >
    > = ["click", "mousedown", "mouseup", "mousemove"];
    mouseEventList.forEach((eventType) => {
      this.canvasElement.addEventListener(eventType, (e) => {
        const s = this.canvasElement.getBoundingClientRect();
        let point: IPoint = {
          x: e.clientX - s.x,
          y: e.clientY - s.y,
        };

        let targetElement = this.getElementFromPoint(point);
        targetElement?.emit(eventType, {
          type: eventType,
          target: targetElement,
          browserMouseEvent: e,
        });
        this.eventEmitter.emit(eventType, {
          type: eventType,
          target: targetElement,
          browserMouseEvent: e,
        });
      });
    });
  }
}
