import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";

export class Path extends GraphicNode {
  isInArtworkTree: boolean = true;
  isContainer: boolean = false;
  pathData = "";
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
}
