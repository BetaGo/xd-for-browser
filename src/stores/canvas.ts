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
      this.render();
    });

    // TODO: del
    // del start

    // Rectangle 2
    const rect2 = new Rectangle(0, 0, 89, 80);
    rect2.name = "Rectangle 2";
    rect2.transform.tx = 60;
    rect2.transform.ty = 106;
    const fillStyle2 = new FillStyle();
    fillStyle2.setColor("rgb(131, 23, 239)");
    fillStyle2.type = "solid";
    const strokeStyle2 = new StrokeStyle();
    strokeStyle2.type = "solid";
    strokeStyle2.setColor("rgb(112,112,112)");
    rect2.style.stroke = strokeStyle2;
    rect2.style.fill = fillStyle2;
    this.gRender.add(rect2);

    // Rectangle 4
    const rect4 = new Rectangle(0, 0, 105, 80);
    rect4.name = "Rectangle 4";
    const fillStyle4 = new FillStyle();
    fillStyle4.type = "gradient";
    const lg4 = new LinearGradient(1, 0.39614754915237427, 0, 0.5);
    lg4.addColorStop(0, "rgb(23,181,239)");
    lg4.addColorStop(1, "rgb(120,12,19)");
    fillStyle4.gradient = lg4;
    const strokeStyle4 = new StrokeStyle();
    strokeStyle4.type = "solid";
    strokeStyle4.setColor("rgb(112,112,112)");
    rect4.style.stroke = strokeStyle4;
    rect4.style.fill = fillStyle4;
    this.gRender.add(rect4);

    // Rectangle 3
    const rect3 = new Rectangle(0, 0, 89, 80);
    rect3.name = "Rectangle 3";
    rect3.transform.tx = 45.75453186035156;
    rect3.transform.ty = 257.63250732421875;
    rect3.transform.a = 0.8571673035621643;
    rect3.transform.b = -0.5150380730628967;
    rect3.transform.c = 0.5150380730628967;
    rect3.transform.d = 0.8571673035621643;
    const fillStyle3 = new FillStyle();
    fillStyle3.setColor("rgb(131, 23, 239)");
    fillStyle3.type = "solid";
    const strokeStyle3 = new StrokeStyle();
    strokeStyle3.type = "solid";
    strokeStyle3.setColor("rgb(112,112,112)");
    rect3.style.stroke = strokeStyle3;
    rect3.style.fill = fillStyle3;
    this.gRender.add(rect3);

    // Rectangle 5
    const rect5 = new Rectangle(0, 0, 105, 80);
    rect5.name = "Rectangle 5";
    rect5.transform.tx = 180.5348358154297;
    rect5.transform.ty = 113.57588958740234;
    rect5.transform.a = 0.4694715738296509;
    rect5.transform.b = -0.882947564125061;
    rect5.transform.c = 0.882947564125061;
    rect5.transform.d = 0.4694715738296509;
    const fillStyle5 = new FillStyle();
    fillStyle5.type = "gradient";
    const lg5 = new LinearGradient(1, 0.39614754915237427, 0, 0.5);
    lg5.addColorStop(0, "rgb(23,181,239)");
    lg5.addColorStop(1, "rgb(120,12,19)");
    fillStyle5.gradient = lg5;
    const strokeStyle5 = new StrokeStyle();
    strokeStyle5.type = "solid";
    strokeStyle5.setColor("rgb(112,112,112)");
    rect5.style.stroke = strokeStyle5;
    rect5.style.fill = fillStyle5;
    this.gRender.add(rect5);

    // TODO: del
    // del end

    this.render();
  }

  render() {
    if (!this.gRender) return;
    this.gRender?.render();
  }
}
