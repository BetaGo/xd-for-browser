import * as math from "mathjs";

export interface IPoint {
  x: number;
  y: number;
}

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];

export function setupCanvas(canvas: HTMLCanvasElement) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;
  const ctx = canvas.getContext("2d");
  ctx?.scale(dpr, dpr);
  return ctx;
}

/**
 * The Crossing Number (cn) method
 * @see http://geomalgorithms.com/a03-_inclusion.html
 *
 *  a point on a left or bottom edge is inside, and a point on a right or top edge is outside
 * @param point
 * @param region
 */
export function pointInRegionCN(point: IPoint, region: IPoint[]): boolean {
  let cn = 0;
  region.reduce((p1, p2) => {
    if (p1.y === p2.y) return p2;
    if (point.y <= Math.min(p1.y, p2.y)) return p2;
    if (point.y > Math.max(p1.y, p2.y)) return p2;

    let x = ((point.y - p1.y) * (p1.x - p2.x)) / (p1.y - p2.y) + p1.x;
    if (x > point.x) cn++;
    return p2;
  }, region[region.length - 1]);
  return cn % 2 === 1;
}

/**
 * The Winding Number (wn) method
 * @see http://geomalgorithms.com/a03-_inclusion.html
 *
 * a point on a left or bottom edge is inside, and a point on a right or top edge is outside
 * @param point
 * @param region
 */
export function pointInRegionWN(point: IPoint, region: IPoint[]): boolean {
  let wn = 0;
  region.reduce((p1, p2) => {
    if (p1.y === p2.y) return p2;
    if (point.y <= Math.min(p1.y, p2.y)) return p2;
    if (point.y > Math.max(p1.y, p2.y)) return p2;

    let x = ((point.y - p1.y) * (p1.x - p2.x)) / (p1.y - p2.y) + p1.x;
    const isUpwardEdge = p2.y < p1.y;
    if (x > point.x) {
      isUpwardEdge ? wn++ : wn--;
    }
    return p2;
  }, region[region.length - 1]);

  return wn !== 0;
}

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
