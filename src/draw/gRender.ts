import EventEmitter from "eventemitter3";
import ResizeObserver from "resize-observer-polyfill";

import { Element } from "./element";
import { IPoint, setupCanvas } from "./utils";

export class GRender {
  containerElement: HTMLElement;
  canvasElement: HTMLCanvasElement;
  canvasCtx2D: CanvasRenderingContext2D;
  elements: Set<Element> = new Set();

  private eventEmitter = new EventEmitter();

  private canvasResizeObserver = new ResizeObserver((entries) => {
    for (const entry of entries) {
      if (entry.target === this.containerElement) {
        this.resizeCanvas();
        this.render();
      }
    }
  });

  constructor(container: HTMLElement) {
    this.containerElement = container;

    this.canvasElement = document.createElement("canvas");
    this.canvasElement.setAttribute(
      "style",
      `display: block; width: 100%; heigh: 100%`
    );
    this.containerElement.appendChild(this.canvasElement);

    this.canvasCtx2D = setupCanvas(this.canvasElement)!;

    this.resizeCanvas();

    // canvas DOM 事件监听
    this.listenCanvasDomEvents();
    // 自定义事件监听
    this.listenCustomEvents();
    // resize 事件监听
    this.canvasResizeObserver.observe(this.canvasElement);
  }

  resizeCanvas() {
    const w = this.containerElement.clientWidth;
    const h = this.containerElement.clientHeight;

    if (w !== this.canvasElement.width || h !== this.canvasElement.height) {
      this.canvasCtx2D = setupCanvas(this.canvasElement)!;
      this.canvasCtx2D.save();
      this.canvasCtx2D.fillStyle = "rgb(228,228,228)";
      this.canvasCtx2D.fillRect(0, 0, w, h);
      this.canvasCtx2D.restore();
    }
  }

  render() {
    this.elements.forEach((e) => e.render());
  }

  add(element: Element) {
    element.gRender = this;
    this.elements.add(element);
  }

  remove(element: Element) {
    this.elements.delete(element);
    this.render();
  }

  listenCanvasDomEvents() {
    this.canvasElement.addEventListener("mousedown", () => {});
    this.canvasElement.addEventListener("mousemove", () => {});
    this.canvasElement.addEventListener("mouseup", () => {});
    this.canvasElement.addEventListener("click", (e) => {
      const s = this.canvasElement.getBoundingClientRect();
      let point: IPoint = {
        x: e.clientX - s.x,
        y: e.clientY - s.y,
      };
      console.log(point);
      this.eventEmitter.emit("click", point);
    });
  }

  listenCustomEvents() {
    this.eventEmitter.on("click", (data: IPoint) => {
      for (const currentElement of this.elements) {
        if (currentElement.isInnerPoint(data)) {
          currentElement.emit("click", {
            type: "click",
            target: currentElement,
          });
          break;
        }
      }
    });
  }
}
