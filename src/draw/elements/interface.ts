import { IRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IPoint } from "../utils";
import { Artboard } from "./artboard";
import { Rectangle } from "./rectangle";

export interface IGRenderElement extends IRenderEventTarget {
  parent: IGRenderElement | null;
  children: IGRenderElement[];
  render(gRender: GRender): void;
  isInnerPoint(point: IPoint): boolean;
}

export type Elements = Artboard | Rectangle;
