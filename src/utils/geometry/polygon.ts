import { Point } from "./geometry";
import { Shape } from "./shape";
import { Vector } from "./vector";
import { Projection } from "./projection";

export class Polygon extends Shape {
  points: Point[];
  constructor(points: Point[] = []) {
    super();
    this.points = points;
  }
  project(axis: Vector) {
    const scalars: number[] = [];
    const v = new Vector();

    this.points.forEach((point) => {
      v.x = point.x;
      v.y = point.y;
      scalars.push(v.dotProduct(axis));
    });
    return new Projection(Math.min(...scalars), Math.max(...scalars));
  }
  getAxes() {
    const v1 = new Vector();
    const v2 = new Vector();
    const axes: Vector[] = [];
    for (let i = 0; i < this.points.length - 1; i++) {
      v1.x = this.points[i].x;
      v1.y = this.points[i].y;

      v2.x = this.points[i + 1].x;
      v2.y = this.points[i + 1].y;

      axes.push(v1.edge(v2).normal());
    }
    return axes;
  }
}
