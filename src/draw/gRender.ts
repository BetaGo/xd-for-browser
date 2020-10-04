import Color from "color";
import EventEmitter from "eventemitter3";
import ResizeObserver from "resize-observer-polyfill";

import { Element } from "./element";
import { IGRenderEventMap } from "./events";
import { ColorParam } from "./style";
import { IPoint, setupCanvas } from "./utils";

export class GRender {
  static init(container: HTMLElement) {
    return new GRender(container);
  }

  containerElement: HTMLElement;
  canvasElement: HTMLCanvasElement;
  canvasCtx2D: CanvasRenderingContext2D;
  elements: Element[] = [];
  eventEmitter = new EventEmitter();
  backgroundColor: Color = new Color("#fff");

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

  constructor(container: HTMLElement) {
    this.containerElement = container;

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.setAttribute(
      "style",
      `display: block; width: 100%; height: 100%`
    );
    this.containerElement.appendChild(this.canvasElement);

    this.canvasCtx2D = setupCanvas(this.canvasElement)!;

    this.resizeCanvas();

    // canvas DOM 事件监听
    this.listenCanvasDomEvents();

    // resize 事件监听
    this.canvasResizeObserver.observe(this.canvasElement);
  }

  setBackgroundColor(color: ColorParam) {
    this.backgroundColor = new Color(color);
  }

  resizeCanvas() {
    this.canvasCtx2D = setupCanvas(this.canvasElement)!;
  }

  render() {
    const rect = this.canvasElement.getBoundingClientRect();
    this.canvasCtx2D.save();
    this.canvasCtx2D.fillStyle = this.backgroundColor.string();
    this.canvasCtx2D.fillRect(0, 0, rect.width, rect.height);
    this.canvasCtx2D.restore();
    for (let i = this.elements.length - 1; i >= 0; i--) {
      const currentElement = this.elements[i];
      currentElement.render();
    }
  }

  add(element: Element) {
    element.gRender = this;
    this.elements.unshift(element);
  }

  remove(element: Element) {
    const index = this.elements.indexOf(element);
    if (index !== -1) {
      this.elements.splice(index, 1);
    }
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

  listenCanvasDomEvents() {
    this.canvasElement.addEventListener("click", (e) => {
      const s = this.canvasElement.getBoundingClientRect();
      let point: IPoint = {
        x: e.clientX - s.x,
        y: e.clientY - s.y,
      };
      console.log(point);
      let targetElement: Element | undefined;
      for (const currentElement of this.elements) {
        if (currentElement.isInnerPoint(point)) {
          targetElement = currentElement;
          currentElement.emit("click", {
            type: "click",
            target: currentElement,
          });
          break;
        }
      }
      this.eventEmitter.emit("click", {
        type: "click",
        target: targetElement,
      });
    });
  }
}
