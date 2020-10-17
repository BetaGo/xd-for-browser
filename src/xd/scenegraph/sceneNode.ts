import { v4 as uuidv4 } from "uuid";
import { Bounds, Interaction, Point } from "../typedefs";
import { Matrix } from "./matrix";

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

  constructor() {
    this.guid = uuidv4();
  }

  blendMode: string = SceneNode.BLEND_MODE_PASSTHROUGH;

  fixedWhenScrolling?: boolean;
  horizontalConstraints?: { position: string; size: string };
  verticalConstraints?: { position: string; size: string };
  pluginData: any;
  sharedPluginData: any;

  readonly guid: string;
  readonly triggeredInteractions: Interaction[] = [];

  abstract readonly parent: SceneNode | null = null;
  abstract readonly children: SceneNode[] = [];
  abstract readonly isInArtworkTree: boolean;
  abstract readonly isContainer: boolean;
  abstract readonly selected: boolean;
  abstract visible: boolean;
  abstract opacity: number;
  abstract readonly transform: Matrix;
  abstract translation: {
    x: number;
    y: number;
  };
  abstract readonly rotation: number;
  abstract readonly globalBounds: Bounds;
  abstract readonly localBounds: Bounds;
  abstract readonly boundsInParent: Bounds;
  abstract readonly topLeftInParent: Point;
  abstract readonly localCenterPoint: Point;
  abstract readonly globalDrawBounds: Bounds;
  abstract name: string;
  abstract readonly hasDefaultName: boolean;
  abstract locked: boolean;
  abstract markedForExport: boolean;
  abstract readonly hasCustomConstraints: boolean;
  abstract restToAutoConstraints(): void;
  abstract readonly hasLinkedContent: boolean;
  abstract removeFromParent(): void;
  abstract moveInParentCoordinates(deltaX: number, deltaY: number): void;
  abstract placeInParentCoordinates(
    registrationPoint: Point,
    parentPoint: Point
  ): void;
  abstract rotateAround(deltaAngle: number, rotationCenter: Point): void;
  abstract resize(width: number, height: number): void;
}
