import { computed, makeObservable, observable } from "mobx";

import { Point } from "../../utils/geometry";
import { RootNode as XdRootNode } from "../../xd/scenegraph/rootNode";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { MixinRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class RootNode
  extends MixinRenderEventTarget(XdRootNode)
  implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];
  parent: (SceneNode & IGRenderElement) | null = null;

  constructor() {
    super();
    makeObservable(this, {
      children: observable,
      parent: observable,
      transform: observable,
      translation: computed,
    });
  }

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

  isInnerPoint(point: Point) {
    return true;
  }
}
