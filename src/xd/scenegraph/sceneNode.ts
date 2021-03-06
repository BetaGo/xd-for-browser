import * as math from "mathjs";
import { v4 as uuidv4 } from "uuid";

import { Vector } from "../../utils/geometry/vector";
import { degree2Radian, radian2Degree } from "../../utils/math";
import { Bounds, Interaction, Point } from "../typedefs";
import {
  createIdentityMatrix,
  createRotateMatrix,
  createTranslateMatrix,
  Matrix,
} from "./matrix";

export abstract class SceneNode {
  static BLEND_MODE_PASSTHROUGH = "BLEND_MODE_PASSTHROUGH";
  static BLEND_MODE_NORMAL = "BLEND_MODE_NORMAL";
  static BLEND_MODE_MULTIPLY = "BLEND_MODE_MULTIPLY";
  static BLEND_MODE_DARKEN = "BLEND_MODE_DARKEN";
  static BLEND_MODE_COLOR_BURN = "BLEND_MODE_COLOR_BURN";
  static BLEND_MODE_LIGHTEN = "BLEND_MODE_LIGHTEN";
  static BLEND_MODE_SCREEN = "BLEND_MODE_SCREEN";
  static BLEND_MODE_COLOR_DODGE = "BLEND_MODE_COLOR_DODGE";
  static BLEND_MODE_OVERLAY = "BLEND_MODE_OVERLAY";
  static BLEND_MODE_SOFT_LIGHT = "BLEND_MODE_SOFT_LIGHT";
  static BLEND_MODE_HARD_LIGHT = "BLEND_MODE_HARD_LIGHT";
  static BLEND_MODE_DIFFERENCE = "BLEND_MODE_DIFFERENCE";
  static BLEND_MODE_EXCLUSION = "BLEND_MODE_EXCLUSION";
  static BLEND_MODE_HUE = "BLEND_MODE_HUE";
  static BLEND_MODE_SATURATION = "BLEND_MODE_SATURATION";
  static BLEND_MODE_COLOR = "BLEND_MODE_COLOR";
  static BLEND_MODE_LUMINOSITY = "BLEND_MODE_LUMINOSITY";
  static FIXED_LEFT = "FIXED_LEFT";
  static FIXED_RIGHT = "FIXED_RIGHT";
  static FIXED_BOTH = "FIXED_BOTH";
  static POSITION_PROPORTIONAL = "POSITION_PROPORTIONAL";
  static SIZE_FIXED = "SIZE_FIXED";
  static SIZE_RESIZES = "SIZE_RESIZES";

  name: string = "";
  blendMode: string = SceneNode.BLEND_MODE_PASSTHROUGH;
  fixedWhenScrolling?: boolean;
  horizontalConstraints?: { position: string; size: string };
  verticalConstraints?: { position: string; size: string };
  pluginData: any;
  sharedPluginData: any;
  visible: boolean = true;
  opacity: number = 1;
  locked: boolean = false;
  markedForExport: boolean = false;
  parent: SceneNode | null = null;
  selected: boolean = false;
  /**
   * degrees
   */
  set rotation(degree: number) {
    this.rotateAround(degree - this.rotation, this.localCenterPoint);
  }

  get rotation(): number {
    let centerPoint: Point = { x: 0, y: 0 };
    let point: Point = { x: 1, y: 0 };
    let tCenterPoint = this.transform.transformPoint(centerPoint);
    let tPoint = this.transform.transformPoint(point);
    let startVec = new Vector(point);
    let currentVec = new Vector(
      tPoint.x - tCenterPoint.x,
      tPoint.y - tCenterPoint.y
    );
    const isRotateLeft =
      (math.cross(
        [currentVec.x, currentVec.y, 0],
        [startVec.x, startVec.y, 0]
      ) as number[])[2] > 0
        ? true
        : false;
    let rotateDeg = radian2Degree(currentVec.getAngle(startVec));
    return isRotateLeft ? -rotateDeg : rotateDeg;
  }

  get globalTransform() {
    let transform = this.transform;
    if (this.parent) {
      transform = this.transform.clone().multiLeft(this.parent.transform);
    }
    return transform;
  }

  get localCenterPoint(): Point {
    return {
      x: this.localBounds.x + this.localBounds.width / 2,
      y: this.localBounds.y + this.localBounds.height / 2,
    };
  }

  get translation() {
    return {
      x: this.transform.e,
      y: this.transform.f,
    };
  }

  removeFromParent() {
    const idx = this.parent?.children.indexOf(this) ?? -1;
    if (idx !== -1) {
      this.parent?.children.splice(idx, 1);
    }
    this.parent = null;
  }

  rotateAround(deltaAngle: number, rotationCenter: Point): void {
    let center = this.transform.transformPoint(rotationCenter);

    let deltaRadian = degree2Radian(deltaAngle);
    const tx = center.x;
    const ty = center.y;
    const m = createTranslateMatrix(-tx, -ty)
      .multiLeft(createRotateMatrix(deltaRadian))
      .multiLeft(createTranslateMatrix(tx, ty));
    this.transform.multiLeft(m);
  }

  readonly guid: string = uuidv4();
  readonly triggeredInteractions: Interaction[] = [];
  readonly children: SceneNode[] = [];
  readonly transform: Matrix = createIdentityMatrix();

  abstract get globalBounds(): Bounds;
  abstract get localBounds(): Bounds;
  abstract get boundsInParent(): Bounds;
  abstract get topLeftInParent(): Point;
  abstract get globalDrawBounds(): Bounds;
  abstract get hasDefaultName(): boolean;
  abstract get hasCustomConstraints(): boolean;
  abstract get hasLinkedContent(): boolean;

  abstract readonly isInArtworkTree: boolean;
  abstract readonly isContainer: boolean;

  abstract restToAutoConstraints(): void;
  abstract moveInParentCoordinates(deltaX: number, deltaY: number): void;
  abstract placeInParentCoordinates(
    registrationPoint: Point,
    parentPoint: Point
  ): void;
  abstract resize(width: number, height: number): void;
}
