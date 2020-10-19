import { GRender } from "../gRender";

export interface IGRenderElement {
  render(gRender: GRender): void;
}
