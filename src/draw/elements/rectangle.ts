import { computed, makeObservable, observable } from "mobx";

import { Point, pointInRegionWN } from "../../utils/geometry";
import { Color } from "../../xd/scenegraph/color";
import { ImageFill } from "../../xd/scenegraph/imageFill";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { Rectangle as XdRectangle } from "../../xd/scenegraph/rectangle";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { MixinRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class Rectangle
  extends MixinRenderEventTarget(XdRectangle)
  implements IGRenderElement {
  parent: (SceneNode & IGRenderElement) | null = null;
  children: Array<SceneNode & IGRenderElement> = [];

  strokeEnabled = true;

  constructor() {
    super();
    makeObservable(this, {
      children: observable,
      parent: observable,
      transform: observable,
      translation: computed,
      width: observable,
      height: observable,
      rotation: computed,
    });
  }

  render(gRender: GRender) {
    const ctx = gRender.canvasCtx2D;
    ctx.save();
    ctx.transform(
      this.transform.a,
      this.transform.b,
      this.transform.c,
      this.transform.d,
      this.transform.e,
      this.transform.f
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
    if (this.strokeEnabled && this.stroke) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke.string();
      ctx.strokeRect(0, 0, this.width, this.height);
    }
    ctx.restore();
  }
  isInnerPoint(point: Point) {
    const region: Point[] = [
      { x: 0, y: 0 },
      { x: 0 + this.width, y: 0 },
      { x: 0 + this.width, y: 0 + this.height },
      { x: 0, y: 0 + this.height },
      { x: 0, y: 0 },
    ];

    const transformedRegion = region.map((v) => {
      return this.transform.transformPoint(v);
    });

    return pointInRegionWN(point, transformedRegion);
  }
}
