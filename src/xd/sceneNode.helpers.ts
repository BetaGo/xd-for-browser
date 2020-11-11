import { RectPoints } from "../utils/geometry";
import { Artboard } from "./scenegraph/artboard";
import { Matrix } from "./scenegraph/matrix";
import { Rectangle } from "./scenegraph/rectangle";
import { RootNode } from "./scenegraph/rootNode";
import { SceneNode } from "./scenegraph/sceneNode";
import { Bounds } from "./typedefs";

export const getBoundingRectPoints = (bounds: Bounds, transform: Matrix) => {
  const rect = bounds;
  const rectPath = [
    { x: rect.x, y: rect.y },
    { x: rect.x + rect.width, y: rect.y },
    { x: rect.x + rect.width, y: rect.y + rect.height },
    { x: rect.x, y: rect.y + rect.height },
  ].map((v) => {
    return transform.transformPoint(v);
  }) as RectPoints;
  return rectPath;
};

export const typeofNode = (node: SceneNode) => {
  if (node instanceof Rectangle) {
    return "rectangle";
  }
  if (node instanceof Artboard) {
    return "artboard";
  }
  if (node instanceof RootNode) {
    return "rootNode";
  }
  // TODO: continue
  return null;
};

export const moveNode = (
  element: SceneNode,
  targetElement: Artboard | RootNode
) => {
  element.transform.e +=
    (element.parent?.globalTransform.e ?? 0) - targetElement.globalTransform.e;
  element.transform.f +=
    (element.parent?.globalTransform.f ?? 0) - targetElement.globalTransform.f;
  element.removeFromParent();
  targetElement.addChild(element);
};

// export const globalPoint2LocalPoint = (
//   node: SceneNode,
//   globalPoint: Point
// ): Point => {};
