import Color from "color";

export type ColorParam =
  | Color
  | string
  | ArrayLike<number>
  | number
  | { [key: string]: any };

type StyleType = "solid" | "gradient" | "none" | undefined;

export interface IStyle {
  fill?: FillStyle;
  stroke?: StrokeStyle;
}

export class Style {
  fill: FillStyle;
  stroke: StrokeStyle;
  constructor() {
    this.fill = new FillStyle();
    this.stroke = new StrokeStyle();
  }
}

export class FillStyle {
  type: StyleType;
  color?: Color;
  gradient?: Gradient;

  setColor(color: ColorParam) {
    this.color = new Color(color);
  }

  toCanvasFillStyle(
    ctx: CanvasRenderingContext2D
  ): CanvasFillStrokeStyles["fillStyle"] | undefined {
    switch (this.type) {
      case "gradient":
        return this.gradient?.toCanvasGradient(ctx);
      case "solid":
        return this.color?.string();
      case "none":
        return;
    }
  }
}

export class StrokeStyle {
  type: StyleType;
  color?: Color;
  gradient?: Gradient;
  width: number = 1;

  setColor(color: ColorParam) {
    this.color = new Color(color);
  }

  toCanvasStrokeStyle(
    ctx: CanvasRenderingContext2D
  ): CanvasFillStrokeStyles["strokeStyle"] | undefined {
    switch (this.type) {
      case "gradient":
        return this.gradient?.toCanvasGradient(ctx);
      case "solid":
        return this.color?.string();
      case "none":
        return;
    }
  }
}

export abstract class Gradient {
  stops: Array<{
    offset: number;
    color: Color;
  }> = [];

  addColorStop(offset: number, color: ColorParam) {
    const c = new Color(color);
    this.stops.push({
      offset,
      color: c,
    });
  }

  abstract toCanvasGradient(ctx: CanvasRenderingContext2D): CanvasGradient;
}

export class LinearGradient extends Gradient {
  constructor(
    public x1: number,
    public y1: number,
    public x2: number,
    public y2: number
  ) {
    super();
  }

  toCanvasGradient(ctx: CanvasRenderingContext2D) {
    const lg = ctx.createLinearGradient(this.x1, this.y1, this.x2, this.y2);
    this.stops.forEach((s) => {
      lg.addColorStop(s.offset, s.color.string());
    });
    return lg;
  }
}

export class RadialGradient extends Gradient {
  constructor(
    public x1: number,
    public y1: number,
    public r1: number,
    public x2: number,
    public y2: number,
    public r2: number
  ) {
    super();
  }
  toCanvasGradient(ctx: CanvasRenderingContext2D) {
    const rg = ctx.createRadialGradient(
      this.x1,
      this.y1,
      this.r2,
      this.x2,
      this.y2,
      this.r2
    );
    this.stops.forEach((s) => {
      rg.addColorStop(s.offset, s.color.string());
    });
    return rg;
  }
}
