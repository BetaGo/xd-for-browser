import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";

export class Rectangle extends GraphicNode {
  hasLinkedGraphicFill: boolean = false;
  isInArtworkTree: boolean = true;
  isContainer: boolean = false;
  width = 0;
  height = 0;

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

  get rotation(): number {
    // TODO:
    return 0;
  }

  get globalBounds(): Bounds {
    return {
      x: this.transform.e,
      y: this.transform.f,
      width: this.width,
      height: this.height,
    };
  }
  get localBounds(): Bounds {
    // TODO:
    return {
      x: this.transform.e,
      y: this.transform.f,
      width: this.width,
      height: this.height,
    };
  }
  get boundsInParent(): Bounds {
    // TODO:
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }
  get topLeftInParent(): Point {
    // TODO:
    return {
      x: 0,
      y: 0,
    };
  }
  get globalDrawBounds(): Bounds {
    // TODO:
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }
  get hasDefaultName(): boolean {
    // TODO:
    return true;
  }
  get hasCustomConstraints(): boolean {
    // TODO:
    return true;
  }
  get hasLinkedContent(): boolean {
    // TODO:
    return false;
  }

  restToAutoConstraints(): void {
    // TODO:
    throw new Error("Method not implemented.");
  }
  removeFromParent(): void {
    const idx = this.parent?.children.indexOf(this) ?? -1;
    if (idx !== -1) {
      this.parent?.children.splice(idx, 1);
    }
    this.parent = null;
  }
  moveInParentCoordinates(deltaX: number, deltaY: number): void {
    // TODO:
    throw new Error("Method not implemented.");
  }
  placeInParentCoordinates(registrationPoint: Point, parentPoint: Point): void {
    // TODO:
    throw new Error("Method not implemented.");
  }
  rotateAround(deltaAngle: number, rotationCenter: Point): void {
    // TODO:
    throw new Error("Method not implemented.");
  }
  resize(width: number, height: number): void {
    // TODO:
    throw new Error("Method not implemented.");
  }
  setAllCornerRadii(radius: number) {
    // TODO:
    throw new Error("Method not implemented.");
  }
}
