import {
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";

import { MouseEventButton } from "../constants";
import { Element } from "../draw/element";
import { RootNode } from "../draw/elements/rootNode";
import { GRender } from "../draw/gRender";
import { IPoint } from "../draw/utils";
import { Matrix } from "../xd/scenegraph/matrix";

class GRenderObservable extends GRender {
  constructor(container: HTMLElement) {
    super(container);
    makeObservable(this, {
      dpr: observable,
      rootNode: observable,
    });
  }
}

export class CanvasStore {
  gRender: GRender | null = null;
  selectedElement?: Element;

  transform?: Matrix;

  zoomValue = 1;

  get artboards() {
    return this.gRender?.rootNode?.children || [];
  }

  get dpr() {
    return this.gRender?.dpr ?? 0;
  }

  constructor() {
    makeAutoObservable(this);
  }

  zoom(value: number, center?: IPoint) {
    const minValue = 0.025;
    const maxValue = 64;
    const v = Math.min(Math.max(value, minValue), maxValue);
    const scaleValue = v / this.zoomValue;
    this.gRender?.scale(scaleValue, center);
    this.zoomValue = v;
    this.render();
  }

  initRender(element: HTMLElement, rootNode: RootNode) {
    this.gRender = new GRenderObservable(element);
    this.gRender.rootNode = rootNode;
    this.gRender.transform.translate(200, 200);
    this.zoom(0.8);

    this.gRender.on("mousedown", (e) => {
      if (e.browserMouseEvent.button === MouseEventButton.Main) {
        runInAction(() => {
          this.selectedElement = e.target;
        });
      }
    });

    this.gRender.on("resize", (e) => {
      this.render();
    });

    this.render();
  }

  render() {
    if (!this.gRender) return;
    this.transform = this.gRender.transform.clone();
    this.gRender?.render();
  }
}
