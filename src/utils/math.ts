import * as math from "mathjs";

/**
 *
 * @param angle radian
 */
export const createRotateMatrix = (angle: number) => {
  return math.matrix([
    [math.cos(angle), -math.sin(angle), 0],
    [math.sin(angle), math.cos(angle), 0],
    [0, 0, 1],
  ]);
};

export const createTranslateMatrix = (x: number, y: number) => {
  return math.matrix([
    [1, 0, x],
    [0, 1, y],
    [0, 0, 1],
  ]);
};
/**
 * multi Matrix product
 * @param values Matrix
 */

export const multiMatrixMultiply = (...values: math.Matrix[]): math.Matrix => {
  return values.reduce((a, b) => math.multiply(a, b));
};

export const degree2Radian = (degree: number): number => {
  return (degree / 180) * Math.PI;
};

export const radian2Degree = (radian: number): number => {
  return (radian / Math.PI) * 180;
};
