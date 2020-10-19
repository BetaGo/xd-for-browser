import ColorJs from "color";
import _ from "lodash";

export type ColorParam =
  | Color
  | string
  | ArrayLike<number>
  | number
  | { [key: string]: any };

export class Color {
  get a(): number {
    return Math.floor(this._color.a() * 255);
  }
  set a(value: number) {
    this._color.alpha(value / 255);
  }
  get r(): number {
    return this._color.red();
  }
  set r(value: number) {
    this._color.red(value);
  }
  get g(): number {
    return this._color.green();
  }
  set g(value: number) {
    this._color.green(value);
  }
  get b(): number {
    return this._color.blue();
  }
  set b(value: number) {
    this._color.blue(value);
  }

  private _color: ColorJs;

  constructor(value: ColorParam, opacity?: number) {
    this._color = ColorJs(value);
    if (opacity) {
      this._color.alpha(opacity);
    }
  }

  toRgba() {
    const obj = this._color.object();
    return {
      a: Math.floor((obj.alpha ?? 1) * 255),
      r: obj.r,
      g: obj.j,
      b: obj.b,
    };
  }

  toHex(forceSixDigits: boolean = false) {
    let arr = this._color.rgb().array();
    let hexArr = arr.slice(0, 3).map((v) => v.toString(16));
    let s = hexArr.join("");
    if ((s.length === 3 || s.length === 6) && !forceSixDigits) {
      return `#${s}`;
    } else {
      s = hexArr
        .map((v) => {
          if (v.length === 1) {
            return "0" + v;
          }
          return v;
        })
        .join("");
      return `#${s}`;
    }
  }

  string() {
    return this._color.string();
  }

  clone() {
    return _.cloneDeep(this);
  }
}
