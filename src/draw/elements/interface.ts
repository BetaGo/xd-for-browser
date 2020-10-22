import { GRender } from "../gRender";
import { IPoint } from "../utils";

export interface IGRenderElement {
  render(gRender: GRender): void;
  isInnerPoint(point: IPoint): boolean;
}
