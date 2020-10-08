import { Matrix, matrix, multiply } from "mathjs";

export class Transform {
  /**
   * Horizontal scaling.
   */
  a: number = 1;
  /**
   * Horizontal skewing.
   */
  b: number = 0;
  /**
   * Vertical skewing.
   */
  c: number = 0;
  /**
   * Vertical scaling.
   */
  d: number = 1;
  /**
   * Horizontal moving.
   */
  tx: number = 0;
  /**
   * Vertical moving.
   */
  ty: number = 0;

  toMatrix() {
    return matrix([
      [this.a, this.c, this.tx],
      [this.b, this.d, this.ty],
      [0, 0, 1],
    ]);
  }

  multiply(t: Matrix, direction: "left" | "right" = "right") {
    const res =
      direction === "left"
        ? multiply(t, this.toMatrix())
        : multiply(this.toMatrix(), t);
    this.a = res.get([0, 0]);
    this.b = res.get([1, 0]);
    this.c = res.get([0, 1]);
    this.d = res.get([1, 1]);
    this.tx = res.get([0, 2]);
    this.ty = res.get([1, 2]);
  }
}
