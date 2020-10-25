import { RootNode as XdRootNode } from "../../xd/scenegraph/rootNode";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class RootNode extends XdRootNode implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];

  render(gRender: GRender) {
    const renderQueue = this.children.slice();
    while (renderQueue.length) {
      const current = renderQueue.shift();
      if (current?.children.length) {
        renderQueue.push(
          ...(current.children as Array<SceneNode & IGRenderElement>)
        );
      }
      current?.render(gRender);
    }
  }

  isInnerPoint() {
    return true;
  }
}
