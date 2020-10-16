import _ from "lodash";
import { inv, multiply } from "mathjs";

import { Element } from "./element";
import { Transform } from "./transform";
import {
  createRotateMatrix,
  createTranslateMatrix,
  IPoint,
  multiMatrixMultiply,
  pointInRegionWN,
  Vec3,
} from "./utils";

export interface IBoundingRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export class BoundingBox {
  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number,
    public transform: Transform = new Transform()
  ) {}

  getTransformed(): IBoundingRect {
    const a: Vec3 = [this.x, this.y, 1];
    const b: Vec3 = [this.x + this.width, this.y, 1];
    const c: Vec3 = [this.x + this.width, this.y + this.height, 1];
    const d: Vec3 = [this.x, this.y + this.height, 1];

    const transformMatrix = this.transform.toMatrix();
    const ta = multiply(transformMatrix, a).toArray() as Vec3;
    const tb = multiply(transformMatrix, b).toArray() as Vec3;
    const tc = multiply(transformMatrix, c).toArray() as Vec3;
    const td = multiply(transformMatrix, d).toArray() as Vec3;

    const x = Math.min(ta[0], tb[0], tc[0], td[0]);
    const y = Math.min(ta[1], tb[1], tc[1], td[1]);

    const width = ((ta[0] - tb[0]) ** 2 + (ta[1] - tb[1]) ** 2) ** 0.5;
    const height = ((ta[0] - td[0]) ** 2 + (ta[1] - td[1]) ** 2) ** 0.5;

    // const eX = multiply(transformMatrix, [1, 0, 1]);
    // const eY = multiply(transformMatrix, [0, 1, 1]);

    const newRect = {
      x,
      y,
      width,
      height,
    };

    return newRect;
  }
}

export class Rectangle extends Element {
  static autoNameCount: number = 0;

  type: string;
  private _name: string = "";

  constructor(
    public x: number,
    public y: number,
    public width: number,
    public height: number
  ) {
    super();
    this.type = "shape";
  }

  get name() {
    if (!this._name) {
      this._name = `Rectangle ${++Rectangle.autoNameCount}`;
    }
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  render() {
    if (!this.visible) return;
    const ctx = this.gRender?.canvasCtx2D;
    if (!ctx) return;
    ctx.save();
    ctx.transform(
      this.transform.a,
      this.transform.b,
      this.transform.c,
      this.transform.d,
      this.transform.tx,
      this.transform.ty
    );
    const strokeStyle = this.style?.stroke?.toCanvasStrokeStyle(ctx, this);
    if (strokeStyle) {
      ctx.strokeStyle = strokeStyle;
      ctx.lineWidth = this.style?.stroke?.width || 1;
      ctx.strokeRect(this.x, this.y, this.width, this.height);
    }
    const fillStyle = this.style?.fill?.toCanvasFillStyle(ctx, this);
    if (fillStyle) {
      ctx.fillStyle = fillStyle;
      ctx.fillRect(this.x, this.y, this.width, this.height);
    }

    ctx.restore();
  }

  update() {}

  updatePosition(point: IPoint) {
    if (this.x !== point.x || this.y !== point.y) {
      this.x = point.x;
      this.y = point.y;
      this.emitBoundingChangeEvent();
    }
  }

  isInnerPoint(point: IPoint): boolean {
    const v: Vec3 = [point.x, point.y, 1];
    const invTransform = inv(this.transform.toMatrix());
    const res = multiply(invTransform, v);
    const p: IPoint = {
      x: res.get([0]),
      y: res.get([1]),
    };
    const pointList: IPoint[] = [
      { x: this.x, y: this.y },
      { x: this.x + this.width, y: this.y },
      { x: this.x + this.width, y: this.y + this.height },
      { x: this.x, y: this.y + this.height },
      { x: this.x, y: this.y },
    ];
    return pointInRegionWN(p, pointList);
  }

  toJSON() {
    const d = {
      name: this.name,
      type: this.type,
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height,
      visible: this.visible,
      style: this.style,
      transform: this.transform,
    };
    return d;
  }

  getBoundingBox() {
    const boundingBox = new BoundingBox(
      this.x,
      this.y,
      this.width,
      this.height,
      _.clone(this.transform)
    );
    return boundingBox;
  }

  setBounding<K extends keyof IBoundingRect>(key: K, value: IBoundingRect[K]) {
    switch (key) {
      case "x": {
        const currentX = this.getBoundingBox().getTransformed().x;
        const m = createTranslateMatrix(value - currentX, 0);
        this.transform.multiply(m, "left");
        this.emitBoundingChangeEvent();
        break;
      }

      case "y": {
        const currentY = this.getBoundingBox().getTransformed().y;
        const m = createTranslateMatrix(0, value - currentY);
        this.transform.multiply(m, "left");
        this.emitBoundingChangeEvent();
        break;
      }

      case "width": {
        this.width = value;
        this.emitBoundingChangeEvent();
        break;
      }

      case "height": {
        this.height = value;
        this.emitBoundingChangeEvent();
        break;
      }

      default:
        break;
    }
  }

  setRotate(angle: number) {
    const shouldRotateAngle = angle - this.rotation;
    if (Math.abs(shouldRotateAngle) > Number.EPSILON) {
      this.rotate(shouldRotateAngle);
      this.rotation = angle % (2 * Math.PI);
    }
  }

  rotate(angle: number, center?: IPoint) {
    if (!center) {
      const centerPointVec: Vec3 = [
        this.x + this.width / 2,
        this.y + this.height / 2,
        1,
      ];
      const [x, y] = multiply(
        this.transform.toMatrix(),
        centerPointVec
      ).toArray() as number[];
      center = {
        x,
        y,
      };
    }
    const tx = center.x;
    const ty = center.y;
    const m = multiMatrixMultiply(
      createTranslateMatrix(tx, ty),
      createRotateMatrix(angle),
      createTranslateMatrix(-tx, -ty)
    );
    this.transform.multiply(m, "left");
    this.emitBoundingChangeEvent();
  }

  private emitBoundingChangeEvent() {
    this.emit("boundingChange", { type: "boundingChange", target: this });
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
