import { IPoint, pointInRegionCN, pointInRegionWN } from "./utils";

describe("draw/utils", () => {
  describe("Inclusion of a Point in Polygon", () => {
    const square10: IPoint[] = [
      { x: 0, y: 0 },
      { x: 10, y: 0 },
      { x: 10, y: 10 },
      { x: 0, y: 10 },
      { x: 0, y: 0 },
    ];

    const overlapPolygon: IPoint[] = [
      { x: 0, y: 0 },
      { x: 8, y: 0 },
      { x: 8, y: 8 },
      { x: 2, y: 8 },
      { x: 2, y: 6 },
      { x: 6, y: 6 },
      { x: 6, y: 4 },
      { x: 4, y: 4 },
      { x: 4, y: 10 },
      { x: 0, y: 10 },
      { x: 0, y: 0 },
    ];

    describe("The Crossing Number (cn) method", () => {
      test("A point on a right or top edge is outside.", () => {
        expect(pointInRegionCN({ x: 10, y: 0 }, square10)).toEqual(false);
      });
      test("A point on a right edge is outside.", () => {
        expect(pointInRegionCN({ x: 10, y: 5 }, square10)).toEqual(false);
      });
      test("A point on a top edge is outside.", () => {
        expect(pointInRegionCN({ x: 5, y: 0 }, square10)).toEqual(false);
      });
      test("A point on a left or bottom edge is inside.", () => {
        expect(pointInRegionCN({ x: 0, y: 10 }, square10)).toEqual(true);
      });
      test("A point on a left  edge is inside.", () => {
        expect(pointInRegionCN({ x: 0, y: 5 }, square10)).toEqual(true);
      });
      test("A point on a bottom edge is inside.", () => {
        expect(pointInRegionCN({ x: 5, y: 10 }, square10)).toEqual(true);
      });
      test("A point on the left and top edge at same time is outside.", () => {
        expect(pointInRegionCN({ x: 0, y: 0 }, square10)).toEqual(false);
      });
      test("A point on the right and bottom edge at same time is outside.", () => {
        expect(pointInRegionCN({ x: 10, y: 10 }, square10)).toEqual(false);
      });
      test("A point is inside", () => {
        expect(pointInRegionCN({ x: 5, y: 5 }, square10)).toEqual(true);
      });

      test("A point in the region of overlap", () => {
        expect(pointInRegionCN({ x: 5, y: 5 }, overlapPolygon)).toEqual(false);
        // This is different between Crossing Number Method and Winding Number Method
        expect(pointInRegionCN({ x: 3, y: 7 }, overlapPolygon)).toEqual(false);
      });
    });
    describe("The Winding Number (wn) method", () => {
      test("A point on a right or top edge is outside.", () => {
        expect(pointInRegionWN({ x: 10, y: 0 }, square10)).toEqual(false);
      });
      test("A point on a right edge is outside.", () => {
        expect(pointInRegionWN({ x: 10, y: 5 }, square10)).toEqual(false);
      });
      test("A point on a top edge is outside.", () => {
        expect(pointInRegionWN({ x: 5, y: 0 }, square10)).toEqual(false);
      });
      test("A point on a left or bottom edge is inside.", () => {
        expect(pointInRegionWN({ x: 0, y: 10 }, square10)).toEqual(true);
      });
      test("A point on a left  edge is inside.", () => {
        expect(pointInRegionWN({ x: 0, y: 5 }, square10)).toEqual(true);
      });
      test("A point on a bottom edge is inside.", () => {
        expect(pointInRegionWN({ x: 5, y: 10 }, square10)).toEqual(true);
      });
      test("A point on the left and top edge at same time is outside.", () => {
        expect(pointInRegionWN({ x: 0, y: 0 }, square10)).toEqual(false);
      });
      test("A point on the right and bottom edge at same time is outside.", () => {
        expect(pointInRegionWN({ x: 10, y: 10 }, square10)).toEqual(false);
      });
      test("A point is inside", () => {
        expect(pointInRegionWN({ x: 5, y: 5 }, square10)).toEqual(true);
      });
      test("A point in the region of overlap", () => {
        expect(pointInRegionWN({ x: 5, y: 5 }, overlapPolygon)).toEqual(false);
        // This is different between Crossing Number Method and Winding Number Method
        expect(pointInRegionWN({ x: 3, y: 7 }, overlapPolygon)).toEqual(true);
      });
    });
  });
});
