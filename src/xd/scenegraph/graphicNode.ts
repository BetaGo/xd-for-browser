import { Blur } from "./blur";
import { Color } from "./color";
import { ImageFill } from "./imageFill";
import { LinearGradient } from "./linearGradient";
import { RadialGradient } from "./radialGradient";
import { SceneNode } from "./sceneNode";
import { Shadow } from "./shadow";

export abstract class GraphicNode extends SceneNode {
  public static INNER_STROKE = "INNER_STROKE";
  public static OUTER_STROKE = "OUTER_STROKE";
  public static CENTER_STROKE = "CENTER_STROKE";
  public static STROKE_CAT_NONE = "STROKE_CAP_NONE";
  public static STROKE_CAP_SQUARE = "STROKE_CAP_SQUARE";
  public static STROKE_CAT_ROUND = "STROKE_CAP_ROUND";
  public static STROKE_JOIN_BEVEL = "STROKE_JOIN_BEVEL";
  public static STROKE_JOIN_ROUND = "STROKE_JOIN_ROUND";
  public static STROKE_JOIN_MITER = "STROKE_JOIN_MITER";

  fill: Color | LinearGradient | ImageFill | RadialGradient | null = null;
  fillEnabled: boolean = true;
  stroke: Color | null = null;
  strokeEnabled: boolean = false;
  strokeWidth: number = 1;
  strokePosition: string = GraphicNode.CENTER_STROKE;
  strokeEndCaps: string = GraphicNode.STROKE_CAP_SQUARE;
  strokeJoins: string = GraphicNode.STROKE_JOIN_MITER;
  strokeMiterLimit: number = 4;
  strokeDashArray: number[] = [];
  strokeDashOffset: number = 0;
  shadow: Shadow | null = null;
  blur: Blur | null = null;
  abstract get pathData(): string;
  abstract get hasLinkedGraphicFill(): boolean;
}
