import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";

export class Polygon extends GraphicNode {
  isInArtworkTree: boolean = true;
  isContainer: boolean = false;

  width = 0;
  height = 0;

  cornerCount: number = 3;
  cornerRadii: number[] = [];

  starRatio: number = 100;

  get hasRoundedCorners(): boolean {
    return this.cornerRadii.some((v) => v > 0);
  }

  get pathData(): string {
    throw new Error("Method not implemented.");
  }
  get hasLinkedGraphicFill(): boolean {
    throw new Error("Method not implemented.");
  }
  get globalBounds(): Bounds {
    throw new Error("Method not implemented.");
  }
  get localBounds(): Bounds {
    throw new Error("Method not implemented.");
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

  setAllCornerRadii(radius: number) {
    this.cornerRadii = new Array(this.cornerCount).fill(radius);
  }

  restToAutoConstraints(): void {
    throw new Error("Method not implemented.");
  }
  removeFromParent(): void {
    throw new Error("Method not implemented.");
  }
  moveInParentCoordinates(deltaX: number, deltaY: number): void {
    throw new Error("Method not implemented.");
  }
  placeInParentCoordinates(registrationPoint: Point, parentPoint: Point): void {
    throw new Error("Method not implemented.");
  }
  rotateAround(deltaAngle: number, rotationCenter: Point): void {
    throw new Error("Method not implemented.");
  }
  resize(width: number, height: number): void {
    throw new Error("Method not implemented.");
  }
}
