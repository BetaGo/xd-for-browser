export interface IPoint {
  x: number;
  y: number;
}

/**
 * @see http://geomalgorithms.com/a03-_inclusion.html
 * @param point
 * @param region
 */
export function pointInRegionCN(point: IPoint, region: IPoint[]): boolean {
  let cn = 0;
  region.reduce((p1, p2) => {
    if (p1.y === p2.y) return p2;
    if (point.y < Math.min(p1.y, p2.y)) return p2;
    if (point.y >= Math.max(p1.y, p2.y)) return p2;

    let x = ((point.y - p1.y) * (p1.x - p2.x)) / (p1.y - p2.y) + p1.x;
    if (x > point.x) cn++;
    return p2;
  }, region[region.length - 1]);
  return cn % 2 === 1;
}

// TODO:
/**
 * @see http://geomalgorithms.com/a03-_inclusion.html
 * @param point
 * @param region
 */
export function pointInRegionWN(point: IPoint, region: IPoint[]): boolean {
  return true;
}
