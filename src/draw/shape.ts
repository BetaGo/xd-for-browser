import { Element } from "./element";

import { IPoint, pointInRegionCN } from "./utils";

export class Rectangle extends Element {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super();
  }

  show() {
    const ctx = this.gRender?.canvasCtx2D;
    if (!ctx) return;
    ctx.save();
    ctx.strokeStyle = "rgb(200,0,0)";
    ctx.strokeRect(
      this.x,
      this.y,
      this.width,

      this.height
    );
    ctx.restore();
  }

  hidden() {}

  isInnerPoint(point: IPoint): boolean {
    const pointList: IPoint[] = [
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height },
      { x: this.x, y: this.y },
    ];
    return pointInRegionCN(point, pointList);
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
//   show() {}

//   hidden() {}
// }

// export class Polygon extends Element {
//   constructor(public points: Array<{ x: number; y: number }>) {
//     super();
//   }
//   show() {}

//   hidden() {}
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
//   show() {}

//   hidden() {}
// }

// export class Path extends Element {
//   constructor(public path: string) {
//     super();
//   }
//   show() {}

//   hidden() {}
// }
