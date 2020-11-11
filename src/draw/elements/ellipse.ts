import { computed, makeObservable, observable } from "mobx";

import { Point } from "../../utils/geometry";
import { Color } from "../../xd/scenegraph/color";
import { ImageFill } from "../../xd/scenegraph/imageFill";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { Ellipse as XdEllipse } from "../../xd/scenegraph/ellipse";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { MixinRenderEventTarget } from "../event";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class Ellipse
  extends MixinRenderEventTarget(XdEllipse)
  implements IGRenderElement {
  parent: (SceneNode & IGRenderElement) | null = null;
  children: Array<SceneNode & IGRenderElement> = [];

  strokeEnabled = true;

  constructor() {
    super();
    makeObservable(this, {
      radiusX: observable,
      radiusY: observable,
      children: observable,
      parent: observable,
      transform: observable,
      translation: computed,
      rotation: computed,
      boundsInParent: computed,
      localBounds: computed,
      globalBounds: computed,
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
    const centerPoint = this.localCenterPoint;
    ctx.beginPath();
    ctx.ellipse(
      centerPoint.x,
      centerPoint.y,
      this.radiusX,
      this.radiusY,
      0,
      0,
      Math.PI * 2
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
      ctx.fill();
    }
    if (this.strokeEnabled && this.stroke) {
      ctx.lineWidth = this.strokeWidth;
      ctx.strokeStyle = this.stroke.string();
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.restore();
  }
  isInnerPoint(point: Point) {
    const centerPoint = this.globalTransform.transformPoint(
      this.localCenterPoint
    );
    return (
      (point.x - centerPoint.x) ** 2 / this.radiusX ** 2 +
        (point.y - centerPoint.y) ** 2 / this.radiusY ** 2 <=
      1
    );
  }
}
