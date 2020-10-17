import { Bounds, Point } from "../typedefs";
import { createIdentityMatrix } from "./matrix";
import { SceneNode } from "./sceneNode";

export class RootNode extends SceneNode {
  name: string = "";
  parent = null;
  isInArtworkTree = true;
  isContainer = true;
  selected = false;
  visible = true;
  opacity = 1;
  transform = createIdentityMatrix();
  translation = {
    x: 0,
    y: 0,
  };
  children: SceneNode[] = [];
  get rotation() {
    return 0;
  }

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

  get localCenterPoint(): Point {
    return {
      x: this.localBounds.x + this.localBounds.width / 2,
      y: this.localBounds.y + this.localBounds.height / 2,
    };
  }

  get globalDrawBounds(): Bounds {
    const boundsList = this.children.map((v) => v.globalDrawBounds);
    return mergeBounds(boundsList);
  }

  get hasDefaultName(): boolean {
    return true;
  }

  get hasCustomConstraints(): boolean {
    return false;
  }
  get hasLinkedContent(): boolean {
    return false;
  }

  locked = false;
  markedForExport = false;
  restToAutoConstraints() {
    // TODO:
  }

  removeFromParent() {
    // TODO:
  }

  moveInParentCoordinates(deltaX: number, deltaY: number) {
    // TODO:
  }

  placeInParentCoordinates(registrationPoint: Point, parentPoint: Point) {
    // TODO:
  }

  rotateAround(deltaAngle: number, rotationCenter: Point) {
    // TODO:
  }

  resize(width: number, height: number) {
    // TODO:
  }

  addChild(node: SceneNode, index?: number): void {
    if (index !== undefined) {
      this.children.splice(index, 0, node);
    } else {
      this.children.push(node);
    }
  }
  addChildAfter(node: SceneNode, relativeTo: SceneNode): void {
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.push(node);
    } else {
      this.children.splice(index + 1, 0, node);
    }
  }
  addChildBefore(node: SceneNode, relativeTo: SceneNode): void {
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.unshift(node);
    } else {
      this.children.splice(index, 0, node);
    }
  }
  removeAllChildren(): void {
    this.children = [];
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
