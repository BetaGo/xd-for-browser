import { IRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { Point } from "../../utils/geometry";
import { Artboard } from "./artboard";
import { Rectangle } from "./rectangle";

export interface IGRenderElement extends IRenderEventTarget {
  parent: IGRenderElement | null;
  children: IGRenderElement[];
  render(gRender: GRender): void;
  isInnerPoint(point: Point): boolean;
}

export type Elements = Artboard | Rectangle;
