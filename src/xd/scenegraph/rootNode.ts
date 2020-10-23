import { Bounds, Point } from "../typedefs";
import { SceneNode } from "./sceneNode";

export class RootNode extends SceneNode {
  isInArtworkTree = true;
  isContainer = true;

  rotation = 0;

  get globalBounds(): Bounds {
    const boundsList = this.children.map((v) => v.globalBounds);
    return mergeBounds(boundsList);
  }

  get localBounds(): Bounds {
    const boundsList = this.children.map((v) => v.localBounds);
    return mergeBounds(boundsList);
  }

  get boundsInParent(): Bounds {
    const boundsList = this.children.map((v) => v.boundsInParent);
    return mergeBounds(boundsList);
  }

  get topLeftInParent(): Point {
    // TODO:
    return {
      x: 0,
      y: 0,
    };
  }

  get globalDrawBounds(): Bounds {
    const boundsList = this.children.map((v) => v.globalDrawBounds);
    return mergeBounds(boundsList);
  }

  get hasDefaultName(): boolean {
    //TODO:
    return true;
  }

  get hasCustomConstraints(): boolean {
    //TODO:
    return false;
  }
  get hasLinkedContent(): boolean {
    //TODO:
    return false;
  }

  locked = false;
  markedForExport = false;
  restToAutoConstraints() {
    // TODO:
    throw new Error("Method not implemented.");
  }

  removeFromParent() {
    // TODO:
    throw new Error("Method not implemented.");
  }

  moveInParentCoordinates(deltaX: number, deltaY: number) {
    // TODO:
    throw new Error("Method not implemented.");
  }

  placeInParentCoordinates(registrationPoint: Point, parentPoint: Point) {
    // TODO:
    throw new Error("Method not implemented.");
  }

  rotateAround(deltaAngle: number, rotationCenter: Point) {
    // TODO:
    throw new Error("Method not implemented.");
  }

  resize(width: number, height: number) {
    // TODO:
    throw new Error("Method not implemented.");
  }

  addChild(node: SceneNode, index?: number): void {
    node.parent = this;
    if (index !== undefined) {
      this.children.splice(index, 0, node);
    } else {
      this.children.push(node);
    }
  }
  addChildAfter(node: SceneNode, relativeTo: SceneNode): void {
    node.parent = this;
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.push(node);
    } else {
      this.children.splice(index + 1, 0, node);
    }
  }
  addChildBefore(node: SceneNode, relativeTo: SceneNode): void {
    node.parent = this;
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.unshift(node);
    } else {
      this.children.splice(index, 0, node);
    }
  }
  removeAllChildren(): void {
    this.children.forEach((v) => (v.parent = null));
    this.children.length = 0;
  }
}

export function mergeBounds(list: Bounds[]): Bounds {
  let minX = 0;
  let minY = 0;
  let maxX = 0;
  let maxY = 0;
  list.forEach((v) => {
    const { x, y, width, height } = v;
    if (x < minX) {
      minX = x;
    }
    if (y < minY) {
      minY = y;
    }
    let currentRight = width + x;
    if (currentRight > maxX) {
      maxX = currentRight;
    }
    let currentBottom = height + y;
    if (currentBottom > maxY) {
      maxY = currentBottom;
    }
  });
  let bounds: Bounds = {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
  };
  return bounds;
}
