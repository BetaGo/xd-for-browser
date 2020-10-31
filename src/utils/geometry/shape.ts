import { Projection } from "./projection";
import { Vector } from "./vector";

export abstract class Shape {
  collidesWidth(otherShape: Shape) {
    const axes = this.getAxes().concat(otherShape.getAxes());
    return !this.separationOnAxes(axes, otherShape);
  }

  separationOnAxes(axes: Vector[], otherShape: Shape) {
    for (let i = 0; i < axes.length; ++i) {
      let axis = axes[i];
      let projection1 = otherShape.project(axis);
      let projection2 = this.project(axis);
      if (!projection1.overlaps(projection2)) {
        return true;
      }
    }
    return false;
  }
  abstract getAxes(): Vector[];
  abstract project(axis: Vector): Projection;
}
