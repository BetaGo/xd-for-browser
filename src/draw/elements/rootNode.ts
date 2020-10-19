import { IGRenderElement } from "./interface";
import { RootNode as XdRootNode } from "../../xd/scenegraph/rootNode";
import { GRender } from "../gRender";
import { SceneNode } from "../../xd/scenegraph/sceneNode";

export class RootNode extends XdRootNode implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];
  render(gRender: GRender) {
    this.children.forEach((e) => {
      e.render(gRender);
    });
  }
}
