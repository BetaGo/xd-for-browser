import { makeObservable, observable, runInAction } from "mobx";

import { MouseEventButton } from "../constants";
import { Element } from "../draw/element";
import { GRender } from "../draw/gRender";
import { setUpDevelopmentInitialCanvasStore } from "../initialState";

export class CanvasStore {
  gRender?: GRender;
  selectedElement?: Element;

  constructor() {
    makeObservable(this, {
      selectedElement: observable,
    });
  }

  initRender(element: HTMLElement) {
    this.gRender = GRender.init(element);
    this.gRender.setBackgroundColor("rgb(228,228,228)");

    setUpDevelopmentInitialCanvasStore(this);

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
