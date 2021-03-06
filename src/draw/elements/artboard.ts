import { computed, makeObservable, observable } from "mobx";

import { Point, pointInRegionWN } from "../../utils/geometry";
import { Artboard as XdArtboard } from "../../xd/scenegraph/artboard";
import { Color } from "../../xd/scenegraph/color";
import { ImageFill } from "../../xd/scenegraph/imageFill";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { MixinRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class Artboard
  extends MixinRenderEventTarget(XdArtboard)
  implements IGRenderElement {
  parent: (SceneNode & IGRenderElement) | null = null;
  children: Array<SceneNode & IGRenderElement> = [];

  constructor() {
    super();
    makeObservable(this, {
      children: observable,
      parent: observable,
      transform: observable,
      width: observable,
      height: observable,
      translation: computed,
    });
  }

  render(gRender: GRender) {
    const ctx = gRender.canvasCtx2D;
    let transform = this.globalTransform;
    ctx.save();
    ctx.transform(
      transform.a,
      transform.b,
      transform.c,
      transform.d,
      transform.e,
      transform.f
    );
    if (this.fillEnabled && this.fill) {
      if (this.fill instanceof Color) {
        ctx.fillStyle = this.fill.string();
      }
      if (this.fill instanceof LinearGradient) {
        // TODO:
      }
      if (this.fill instanceof RadialGradient) {
        // TODO:
      }

      if (this.fill instanceof ImageFill) {
        // TODO:
      }
      ctx.fillRect(0, 0, this.width, this.height);
    }
    ctx.restore();
  }

  isInnerPoint(point: Point): boolean {
    const region: Point[] = [
      { x: this.globalTransform.e, y: this.globalTransform.f },
      { x: this.globalTransform.e + this.width, y: this.globalTransform.f },
      {
        x: this.globalTransform.e + this.width,
        y: this.globalTransform.f + this.height,
      },
      { x: this.globalTransform.e, y: this.globalTransform.f + this.height },
      { x: this.globalTransform.e, y: this.globalTransform.f },
    ];
    return pointInRegionWN(point, region);
  }
}
