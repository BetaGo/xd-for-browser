import {
  makeAutoObservable,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { MouseEventButton } from "../constants";

import { Artboard } from "../draw/elements/artboard";
import { RootNode } from "../draw/elements/rootNode";
import { GRender } from "../draw/gRender";
import { IPoint } from "../draw/utils";
import { Matrix } from "../xd/scenegraph/matrix";
import { SceneNode } from "../xd/scenegraph/sceneNode";

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
  selectedElement: SceneNode | null = null;

  transform?: Matrix;

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

  zoom(value: number, center?: IPoint) {
    this.gRender?.zoom(value, center);
    this.render();
  }

  initRender(element: HTMLElement, rootNode: RootNode) {
    this.gRender = new GRenderObservable(element);
    this.gRender.rootNode = rootNode;
    this.gRender.translate(100, 100);
    this.zoom(0.8);

    rootNode.addEventListener("mousedown", (e) => {
      if (e.button === MouseEventButton.Main) {
        runInAction(() => {
          if (e.target instanceof SceneNode) {
            this.selectedElement = e.target;
            console.log(e.target);
          } else {
            this.selectedElement = null;
          }
        });
      }
    });

    // this.gRender.on("mousedown", (e) => {
    //   if (e.browserMouseEvent.button === MouseEventButton.Main) {
    //     runInAction(() => {
    //       this.selectedElement = e.target;
    //     });
    //   }
    // });

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
