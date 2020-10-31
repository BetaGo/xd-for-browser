import _ from "lodash";
import * as math from "mathjs";

import { Bounds, Point } from "../typedefs";

export class Matrix {
  constructor(
    public a: number,
    public b: number,
    public c: number,
    public d: number,
    public e: number,
    public f: number
  ) {}

  setForm(otherMatrix: Matrix) {
    this.a = otherMatrix.a;
    this.b = otherMatrix.b;
    this.c = otherMatrix.c;
    this.d = otherMatrix.d;
    this.e = otherMatrix.e;
    this.f = otherMatrix.f;
  }
  clone() {
    return _.cloneDeep(this);
  }

  add(matrix: Matrix): Matrix;
  add(a: number, b: number, c: number, d: number, e: number, f: number): Matrix;
  add(
    aOrMatrix: number | Matrix,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number
  ) {
    if (aOrMatrix instanceof Matrix) {
      this.a += aOrMatrix.a;
      this.b += aOrMatrix.b;
      this.c += aOrMatrix.c;
      this.d += aOrMatrix.d;
      this.e += aOrMatrix.e;
      this.f += aOrMatrix.f;
    } else {
      this.a += aOrMatrix;
      this.b += b ?? 0;
      this.c += c ?? 0;
      this.d += d ?? 0;
      this.e += e ?? 0;
      this.f = f ?? 0;
    }
    return this;
  }

  multiLeft(matrix: Matrix): Matrix;
  multiLeft(
    a: number,
    b: number,
    c: number,
    d: number,
    e: number,
    f: number
  ): Matrix;
  multiLeft(
    aOrMatrix: number | Matrix,
    b?: number,
    c?: number,
    d?: number,
    e?: number,
    f?: number
  ) {
    let mA, mB, mC, mD, mE, mF;
    if (aOrMatrix instanceof Matrix) {
      mA = aOrMatrix.a;
      mB = aOrMatrix.b;
      mC = aOrMatrix.c;
      mD = aOrMatrix.d;
      mE = aOrMatrix.e;
      mF = aOrMatrix.f;
    } else {
      mA = aOrMatrix;
      mB = b ?? 0;
      mC = c ?? 0;
      mD = d ?? 1;
      mE = e ?? 0;
      mF = f ?? 0;
    }
    const m1 = this.toArray();
    const m2 = math.matrix([
      [mA, mC, mE],
      [mB, mD, mF],
      [0, 0, 1],
    ]);

    const res = math.multiply(m2, m1);
    this.a = res.get([0, 0]);
    this.b = res.get([1, 0]);
    this.c = res.get([0, 1]);
    this.d = res.get([1, 1]);
    this.e = res.get([0, 2]);
    this.f = res.get([1, 2]);
    return this;
  }

  invert(): Matrix {
    const invMatrix = math.inv(math.matrix(this.toArray()));
    return new Matrix(
      invMatrix.get([0, 0]),
      invMatrix.get([1, 0]),
      invMatrix.get([0, 1]),
      invMatrix.get([1, 1]),
      invMatrix.get([0, 2]),
      invMatrix.get([1, 2])
    );
  }

  translate(tx: number, ty: number): Matrix {
    this.e += tx;
    this.f += ty;
    return this;
  }

  scale(s: number): Matrix;
  scale(sx: number, sy: number): Matrix;
  scale(sx: number, sy: number, cx: number, cy: number): Matrix;
  scale(...args: number[]) {
    if (args.length === 1) {
      const [s] = args;
      this.a *= s;
      this.d *= s;
    } else if (args.length === 2) {
      const [sx, sy] = args;
      this.a *= sx;
      this.d *= sy;
    } else if (args.length === 4) {
      const [sx, sy, cx, cy] = args;
      this.a *= sx;
      this.d *= sy;
      this.e += cx * (1 - sx);
      this.f += cy * (1 - sy);
    }
    return this;
  }

  rotate(angle: number): Matrix;
  rotate(angle: number, cx: number, cy: number): Matrix;
  rotate(...args: number[]): Matrix {
    let m = createRotateMatrix(args[0]);
    if (args.length === 3) {
      const [angle, cx, cy] = args;
      m = createIdentityMatrix();
      m.translate(-cx, -cy);
      m.rotate(angle);
      m.translate(cx, cy);
    }
    this.multiLeft(m);
    return this;
  }

  x(x: number, y: number): number {
    // TODO:
    return 0;
  }

  y(x: number, y: number): number {
    // TODO:
    return 0;
  }

  transformPoint(point: Point): Point {
    const vec = [point.x, point.y, 1];
    const res = math.multiply(math.matrix(this.toArray()), vec);
    return {
      x: res.get([0]),
      y: res.get([1]),
    };
  }

  transformRect(rect: Bounds): Bounds {
    // TODO:
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  getTranslate(): number[] {
    return [this.e, this.f];
  }

  scaleFactors() {
    // TODO:
    return {
      scaleX: Math.acos(this.a),
      scaleY: Math.acos(this.d),
    };
  }

  removedScaleMatrix(scaleX: number, scaleY: number) {
    // TODO:
    return this.clone();
  }

  hasSkew(): boolean {
    return this.b !== 0 || this.c !== 0;
  }

  private toArray(): number[][] {
    return [
      [this.a, this.c, this.e],
      [this.b, this.d, this.f],
      [0, 0, 1],
    ];
  }
}

export function createTransformMatrix(tx: number, ty: number): Matrix {
  return new Matrix(1, 0, 0, 1, tx, ty);
}

export function createRotateMatrix(angle: number) {
  return new Matrix(
    Math.cos(angle),
    Math.sin(angle),
    -Math.sin(angle),
    Math.cos(angle),
    0,
    0
  );
}

export function createIdentityMatrix() {
  return new Matrix(1, 0, 0, 1, 0, 0);
}
