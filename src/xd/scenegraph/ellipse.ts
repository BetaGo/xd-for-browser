import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";

export class Ellipse extends GraphicNode {
  radiusX: number = 0;
  radiusY: number = 0;
  get localBounds(): Bounds {
    return {
      x: 0,
      y: 0,
      width: this.radiusX * 2,
      height: this.radiusY * 2,
    };
  }
  get boundsInParent(): Bounds {
    throw new Error("Method not implemented.");
  }
  get topLeftInParent(): Point {
    throw new Error("Method not implemented.");
  }
  get globalDrawBounds(): Bounds {
    throw new Error("Method not implemented.");
  }
  get hasDefaultName(): boolean {
    throw new Error("Method not implemented.");
  }
  get hasCustomConstraints(): boolean {
    throw new Error("Method not implemented.");
  }
  get hasLinkedContent(): boolean {
    throw new Error("Method not implemented.");
  }
  restToAutoConstraints(): void {
    throw new Error("Method not implemented.");
  }
  moveInParentCoordinates(deltaX: number, deltaY: number): void {
    throw new Error("Method not implemented.");
  }
  placeInParentCoordinates(registrationPoint: Point, parentPoint: Point): void {
    throw new Error("Method not implemented.");
  }
  resize(width: number, height: number): void {
    throw new Error("Method not implemented.");
  }

  hasLinkedGraphicFill: boolean = false;
  isInArtworkTree: boolean = true;
  isContainer: boolean = false;

  get pathData(): string {
    // TODO:
    return "";
  }

  get cornerRadii() {
    // TODO:
    return {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    };
  }

  get effectiveCornerRadii() {
    //TODO:
    return {
      topLeft: 0,
      topRight: 0,
      bottomRight: 0,
      bottomLeft: 0,
    };
  }

  get hasRoundedCorners(): boolean {
    // TODO:
    return false;
  }

  get globalBounds(): Bounds {
    return {
      x: this.globalTransform.e,
      y: this.globalTransform.f,
      width: this.radiusX * 2,
      height: this.radiusY * 2,
    };
  }

  get isCircle(): boolean {
    return this.radiusX === this.radiusY;
  }
}
