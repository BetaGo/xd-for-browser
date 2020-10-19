import _ from "lodash";
import { Color } from "./color";
export class LinearGradient {
  colorStops: Array<{
    stop: number;
    color: Color;
  }> = [];

  startX?: number;
  startY?: number;
  endX?: number;
  endY?: number;
  clone() {
    return _.cloneDeep(this);
  }
  getEndPoints() {
    return [this.startX, this.startY, this.endX, this.endY];
  }
  setEndPoints(startX: number, startY: number, endX: number, endY: number) {
    this.startX = startX;
    this.startY = startY;
    this.endX = endX;
    this.endY = endY;
  }
}
