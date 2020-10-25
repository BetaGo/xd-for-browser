import EventEmitter from "eventemitter3";
import { Artboard as XdArtboard } from "../../xd/scenegraph/artboard";
import { Color } from "../../xd/scenegraph/color";
import { ImageFill } from "../../xd/scenegraph/imageFill";
import { LinearGradient } from "../../xd/scenegraph/linearGradient";
import { RadialGradient } from "../../xd/scenegraph/radialGradient";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { GRender } from "../gRender";
import { IPoint, pointInRegionWN } from "../utils";
import { IGRenderElement } from "./interface";

export class Artboard extends XdArtboard implements IGRenderElement {
  private eventEmitter = new EventEmitter();

  addEventListener(
    type: string,
    listener: EventListener | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(
    type: string,
    listener: EventListener | null,
    options?: boolean | AddEventListenerOptions
  ): void;
  addEventListener(type: any, listener: any, options?: any) {
    this.eventEmitter.on(type, listener);
  }

  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: Event): boolean;
  dispatchEvent(event: any) {
    return true;
    throw new Error("Method not implemented.");
  }

  removeEventListener(
    type: string,
    callback: EventListener | null,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(
    type: string,
    callback: EventListener | null,
    options?: boolean | EventListenerOptions
  ): void;
  removeEventListener(type: any, callback: any, options?: any) {
    throw new Error("Method not implemented.");
  }

  children: Array<SceneNode & IGRenderElement> = [];
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
    ctx.restore();
  }

  isInnerPoint(point: IPoint): boolean {
    const region: IPoint[] = [
      { x: this.transform.e, y: this.transform.f },
      { x: this.transform.e + this.width, y: this.transform.f },
      { x: this.transform.e + this.width, y: this.transform.f + this.height },
      { x: this.transform.e, y: this.transform.f + this.height },
      { x: this.transform.e, y: this.transform.f },
    ];
    return pointInRegionWN(point, region);
  }
}
