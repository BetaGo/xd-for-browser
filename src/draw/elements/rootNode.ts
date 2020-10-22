import { RootNode as XdRootNode } from "../../xd/scenegraph/rootNode";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class RootNode extends XdRootNode implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];

  render(gRender: GRender) {
    this.children.forEach((e) => {
      e.render(gRender);
    });
  }

  isInnerPoint() {
    return true;
  }
}
