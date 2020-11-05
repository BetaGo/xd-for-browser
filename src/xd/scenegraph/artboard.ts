import { Bounds, Interaction, Point } from "../typedefs";
import { GraphicNode } from "./graphicNode";
import { SceneNode } from "./sceneNode";

export class Artboard extends GraphicNode {
  width: number = 0;
  height: number = 0;
  viewPortHeight: number | null = null;
  incomingInteractions: Array<{
    triggerNode: SceneNode;
    interactions: Interaction[];
  }> = [];
  isInArtworkTree = true;
  isContainer = true;
  locked = false;
  markedForExport = false;

  get globalBounds(): Bounds {
    return {
      x: this.transform.e,
      y: this.transform.f,
      width: this.width,
      height: this.height,
    };
  }

  get localBounds(): Bounds {
    return {
      x: 0,
      y: 0,
      width: this.width,
      height: this.height,
    };
  }

  get boundsInParent(): Bounds {
    return {
      x: this.transform.e,
      y: this.transform.f,
      width: this.width,
      height: this.height,
    };
  }

  get topLeftInParent(): Point {
    return {
      x: this.transform.e,
      y: this.transform.f,
    };
  }

  get globalDrawBounds(): Bounds {
    //TODO:
    return this.globalBounds;
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

  get hasLinkedGraphicFill(): boolean {
    //TODO:
    return false;
  }

  get pathData(): string {
    //TODO:
    return "";
  }

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

  addChild(node: SceneNode, index?: number) {
    node.parent = this;
    if (index !== undefined) {
      this.children.splice(index, 0, node);
    } else {
      this.children.push(node);
    }
  }
  addChildAfter(node: SceneNode, relativeTo: SceneNode) {
    node.parent = this;
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.push(node);
    } else {
      this.children.splice(index + 1, 0, node);
    }
  }
  addChildBefore(node: SceneNode, relativeTo: SceneNode) {
    node.parent = this;
    const index = this.children.indexOf(relativeTo);
    if (index === -1) {
      this.children.unshift(node);
    } else {
      this.children.splice(index, 0, node);
    }
  }
  removeAllChildren() {
    this.children.forEach((v) => (v.parent = null));
    this.children.length = 0;
  }
  dynamicLayout?: boolean;
}
