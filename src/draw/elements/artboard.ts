import { Artboard as XdArtboard } from "../../xd/scenegraph/artboard";
import { Color } from "../../xd/scenegraph/color";
import { ImageFill } from "../../xd/scenegraph/imageFill";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { GRender } from "../gRender";
import { IGRenderElement } from "./interface";

export class Artboard extends XdArtboard implements IGRenderElement {
  render(gRender: GRender) {
    this.renderTitle();
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
      ctx.fillRect(
        this.globalBounds.x,
        this.globalBounds.y,
        this.width,
        this.height
      );
    }
    ctx.restore();
  }

  renderTitle() {
    // TODO: render editable title text
  }
}
