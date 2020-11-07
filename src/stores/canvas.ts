import { makeAutoObservable, makeObservable, observable } from "mobx";

import { Artboard } from "../draw/elements/artboard";
import { RootNode } from "../draw/elements/rootNode";
import { GRender } from "../draw/gRender";
import { Point } from "../utils/geometry";
import { Matrix } from "../xd/scenegraph/matrix";
import { Selection } from "../xd/scenegraph/selection";

class GRenderObservable extends GRender {
  constructor(container: HTMLElement) {
    super(container);
    makeObservable(this, {
      dpr: observable,
      zoomValue: observable,
      rootNode: observable,
    });
  }
}

export class CanvasStore {
  gRender: GRender | null = null;
  // selectedElements: Set<SceneNode> = new Set();
  selection = new Selection();
  transform?: Matrix;

  private afterInitRenderQueue: Function[] = [];

  get zoomValue() {
    return this.gRender?.zoomValue ?? 1;
  }

  get artboards(): Artboard[] {
    return (this.gRender?.rootNode?.children || []).filter(
      (v) => v instanceof Artboard
    ) as Artboard[];
  }

  get dpr() {
    return this.gRender?.dpr ?? 0;
  }

  constructor() {
    makeAutoObservable(this);
  }

  zoom(value: number, center?: Point) {
    this.gRender?.zoom(value, center);
    this.render();
  }

  initRender(element: HTMLElement, rootNode: RootNode) {
    this.gRender = new GRenderObservable(element);
    this.gRender.rootNode = rootNode;
    this.gRender.translate(100, 100);
    this.zoom(0.8);

    this.gRender.on("resize", (e) => {
      this.render();
    });

    this.render();

    this.afterInitRenderQueue.forEach((v) => v());
  }

  runAfterInitRender(cb: Function) {
    this.afterInitRenderQueue.push(cb);
  }

  render() {
    if (!this.gRender) return;
    this.transform = this.gRender.transform.clone();
    this.gRender?.render();
  }

  clientPoint2CanvasPoint(point: Point): Point {
    if (!this.gRender) return point;
    const rect = this.gRender.canvasElement.getBoundingClientRect();
    const domX = point.x - rect.x;
    const tx = this.transform?.e ?? 0;
    const domY = point.y - rect.y;
    const ty = this.transform?.f ?? 0;
    const x = (domX - tx / this.dpr) / this.zoomValue;
    const y = (domY - ty / this.dpr) / this.zoomValue;
    return { x, y };
  }
}
