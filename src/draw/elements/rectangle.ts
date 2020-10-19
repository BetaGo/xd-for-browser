import { IGRenderElement } from "./interface";
import { Rectangle as XdRectangle } from "../../xd/scenegraph/rectangle";
import { GRender } from "../gRender";
import { SceneNode } from "../../xd/scenegraph/sceneNode";

export class Rectangle extends XdRectangle implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];
  render(gRender: GRender) {}
}
