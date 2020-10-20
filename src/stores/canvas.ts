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

class GRenderObservable extends GRender {
  constructor(container: HTMLElement) {
    super(container);
    makeObservable(this, {
      scale: observable,
    });
  }
}

export class CanvasStore {
  gRender?: GRender;
  selectedElement?: Element;

  get scale() {
    return this.gRender?.scale ?? 1;
  }

  constructor() {
    makeAutoObservable(this);
  }

  zoom(value: number, center?: IPoint) {
    this.gRender?.zoom(value, center);
  }

  initRender(element: HTMLElement, rootNode: RootNode) {
    this.gRender = new GRenderObservable(element);
    this.gRender.rootNode = rootNode;

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
    this.gRender?.render();
  }
}
