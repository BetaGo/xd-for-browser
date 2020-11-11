import { degree2Radian } from "../../utils/math";
import { Bounds, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";
import { createRotateMatrix, createTranslateMatrix } from "./matrix";

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

  get globalBounds(): Bounds {
    return {
      x: this.globalTransform.e,
      y: this.globalTransform.f,
      width: this.width,
      height: this.height,
    };
  }
  get localBounds(): Bounds {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }
  get boundsInParent(): Bounds {
    return {
      x: this.transform.e - (this.parent?.transform.e ?? 0),
      y: this.transform.f - (this.parent?.transform.f ?? 0),
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
    let center = this.transform.transformPoint(rotationCenter);
    // this.rotation = (this.rotation + deltaAngle) % 360;

    let deltaRadian = degree2Radian(deltaAngle);
    const tx = center.x;
    const ty = center.y;
    const m = createTranslateMatrix(-tx, -ty)
      .multiLeft(createRotateMatrix(deltaRadian))
      .multiLeft(createTranslateMatrix(tx, ty));
    this.transform.multiLeft(m);
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
