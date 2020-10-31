import { Polygon } from "./polygon";

export type Point = {
  x: number;
  y: number;
};

export type Vec2 = [number, number];
export type Vec3 = [number, number, number];
export type Rect = { x: number; y: number; width: number; height: number };
export type RectPoints = [Point, Point, Point, Point];

export const isRectOverlap = (rect1: RectPoints, rect2: RectPoints) => {
  const p1 = new Polygon(rect1);
  const p2 = new Polygon(rect2);
  return p1.collidesWidth(p2);
};

/**
 * The Crossing Number (cn) method
 * @see http://geomalgorithms.com/a03-_inclusion.html
 *
 *  a point on a left or bottom edge is inside, and a point on a right or top edge is outside
 * @param point
 * @param region
 */
export function pointInRegionCN(point: Point, region: Point[]): boolean {
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
export function pointInRegionWN(point: Point, region: Point[]): boolean {
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
