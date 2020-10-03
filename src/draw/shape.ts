import { Element } from "./element";
import { IPoint, pointInRegionWN } from "./utils";
import _ from "lodash";

export class Rectangle extends Element {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super();
  }

  render() {
    if (!this.visible) return;
    const ctx = this.gRender?.canvasCtx2D;
    if (!ctx) return;
    ctx.save();
    const strokeStyle = this.style?.stroke?.toCanvasStrokeStyle(ctx);
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = this.style?.stroke?.width || 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    const fillStyle = this.style?.fill?.toCanvasFillStyle(ctx);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }
    ctx.restore();
  }

  isInnerPoint(point: IPoint): boolean {
    const pointList: IPoint[] = [
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height },
      { x: this.x, y: this.y },
    ];
    return pointInRegionWN(point, pointList);
  }
}

// export class Ellipse extends Element {
//   constructor(
//     public cx: number,
//     public cy: number,
//     public rx: number,
//     public ry: number
//   ) {
//     super();
//   }
//   render() {}

// }

// export class Polygon extends Element {
//   constructor(public points: Array<{ x: number; y: number }>) {
//     super();
//   }
//   render() {}

// }

// export class Line extends Element {
//   constructor(
//     public x1: number,
//     public y1: number,
//     public x2: number,
//     public y2: number
//   ) {
//     super();
//   }
//   render() {}
// }

// export class Path extends Element {
//   constructor(public path: string) {
//     super();
//   }
//   render() {}
// }
