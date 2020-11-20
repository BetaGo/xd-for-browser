import { Point } from "./geometry";

export class Vector {
  x: number;
  y: number;

  constructor(point: Point);
  constructor(x: number, y: number);
  constructor();
  constructor(...params: any[]) {
    if (params.length === 1) {
      const point: Point = params[0];
      this.x = point.x;
      this.y = point.y;
    } else if (params.length === 2) {
      this.x = params[0];
      this.y = params[1];
    } else {
      this.x = 1;
      this.y = 0;
    }
  }

  getMagnitude(): number {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  add(vector: Vector): Vector {
    const v = new Vector(this.x + vector.x, this.y + vector.y);
    return v;
  }

  subtract(vector: Vector): Vector {
    const v = new Vector(this.x - vector.x, this.y - vector.y);
    return v;
  }

  dotProduct(vector: Vector): number {
    return this.x * vector.x + this.y * vector.y;
  }

  edge(vector: Vector) {
    return this.subtract(vector);
  }

  perpendicular() {
    const v = new Vector(this.y, 0 - this.x);
    return v;
  }

  normalize() {
    const v = new Vector(0, 0);
    const m = this.getMagnitude();
    if (m !== 0) {
      v.x = this.x / m;
      v.y = this.y / m;
    }
    return v;
  }

  normal() {
    const p = this.perpendicular();
    return p.normalize();
  }

  getAngle(vector: Vector): number {
    let cosA = Math.min(
      1,
      this.dotProduct(vector) / (this.getMagnitude() * vector.getMagnitude())
    );
    return Math.acos(cosA);
  }
}
