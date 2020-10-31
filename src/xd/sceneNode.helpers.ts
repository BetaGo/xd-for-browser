import * as math from "mathjs";

import { RectPoints, Vec3 } from "../utils/geometry";
import { createRotateMatrix, degree2Radian } from "../utils/math";
import { Bounds } from "./typedefs";

export const boundsToRectPoints = (bounds: Bounds, rotation: number) => {
  const rect = bounds;
  const rotateMatrix = createRotateMatrix(degree2Radian(rotation));
  const rectPath = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ].map((v) => {
    const vector: Vec3 = [v.x, v.y, 1];
    const res = math.multiply(rotateMatrix, vector);
    return {
      x: res.get([0]),
      y: res.get([1]),
    };
  }) as RectPoints;
  return rectPath;
};