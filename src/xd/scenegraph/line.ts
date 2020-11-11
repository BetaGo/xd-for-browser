import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";

export class Line extends GraphicNode {
  start: Point = { x: 0, y: 0 };
  end: Point = { x: 0, y: 0 };
  isInArtworkTree: boolean = true;
  isContainer: boolean = false;
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

  setStartEnd(startX: number, startY: number, endX: number, endY: number) {
    this.start.x = startX;
    this.start.y = startY;
    this.end.x = endX;
    this.end.y = endY;
  }
}
