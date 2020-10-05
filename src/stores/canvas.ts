import { computed, makeObservable, observable, runInAction } from "mobx";

import { MouseEventButton } from "../constants";
import { Element } from "../draw/element";
import { GRender } from "../draw/gRender";
import { Rectangle } from "../draw/shape";
import { FillStyle, LinearGradient, StrokeStyle } from "../draw/style";

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

    this.gRender.on("mousedown", (e) => {
      if (e.browserMouseEvent.button === MouseEventButton.Main) {
        runInAction(() => {
          this.selectedElement = e.target;
        });
      }
    });

    this.gRender.on("resize", (e) => {
      console.log("resize", e);
      this.render();
    });

    const rect = new Rectangle(100, 100, 300, 200);

    const fillStyle = new FillStyle();
    fillStyle.setColor("#258");
    fillStyle.type = "gradient";
    const lg = new LinearGradient(200, 100, 200, 300);
    lg.addColorStop(0, "#fff");
    lg.addColorStop(1, "#000");
    fillStyle.gradient = lg;

    const strokeStyle = new StrokeStyle();
    strokeStyle.type = "solid";
    strokeStyle.width = 2;
    strokeStyle.setColor("#36d");
    rect.style = {
      stroke: strokeStyle,
      fill: fillStyle,
    };

    this.gRender.add(rect);
    this.render();
  }

  render() {
    if (!this.gRender) return;
    this.gRender?.render();
  }
}
