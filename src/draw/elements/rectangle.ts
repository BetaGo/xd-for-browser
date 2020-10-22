import { IGRenderElement } from "./interface";
import { Rectangle as XdRectangle } from "../../xd/scenegraph/rectangle";
import { GRender } from "../gRender";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { IPoint } from "../utils";
import { Color } from "../../xd/scenegraph/color";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { ImageFill } from "../../xd/scenegraph/imageFill";

export class Rectangle extends XdRectangle implements IGRenderElement {
  children: Array<SceneNode & IGRenderElement> = [];
  strokeEnabled = true;
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
      ctx.stroke();
    }
    ctx.restore();
  }
  isInnerPoint(point: IPoint) {
    // TODO:
    return false;
  }
}
