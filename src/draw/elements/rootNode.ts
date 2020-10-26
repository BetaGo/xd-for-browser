import { RootNode as XdRootNode } from "../../xd/scenegraph/rootNode";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { MixinRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IPoint } from "../utils";
import { IGRenderElement } from "./interface";

export class RootNode
  extends MixinRenderEventTarget(XdRootNode)
  implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];
  parent: (SceneNode & IGRenderElement) | null = null;

  render(gRender: GRender) {
    const renderQueue = this.children.slice();
    while (renderQueue.length) {
      const current = renderQueue.shift();
      if (current?.children.length) {
        renderQueue.push(...current.children);
      }
      current?.render(gRender);
    }
  }

  isInnerPoint(point: IPoint) {
    return true;
  }
}
