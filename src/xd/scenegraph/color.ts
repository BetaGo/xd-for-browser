import ColorJs from "color";
import _ from "lodash";
import { makeAutoObservable } from "mobx";

export type ColorParam =
  | Color
  | string
  | ArrayLike<number>
  | number
  | { [key: string]: any };

export class Color {
  a: number;
  r: number;
  g: number;
  b: number;

  constructor(value: ColorParam, opacity?: number) {
    makeAutoObservable(this);
    const color = ColorJs(value);
    if (opacity) {
      color.alpha(opacity);
    }
    this.a = color.alpha() * 255;
    this.r = color.red();
    this.g = color.green();
    this.b = color.blue();
  }

  toRgba() {
    return {
      a: this.a,
      r: this.r,
      g: this.g,
      b: this.b,
    };
  }

  toHex(forceSixDigits: boolean = false) {
    let arr = [this.r, this.g, this.b];
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
    const s = `rgba(${this.r},${this.g},${this.b},${this.a / 255})`;
    const color = ColorJs(s);
    return color.string();
  }

  clone() {
    return _.cloneDeep(this);
  }
}
