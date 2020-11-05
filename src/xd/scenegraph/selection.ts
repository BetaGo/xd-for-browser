import { makeAutoObservable } from "mobx";
import { Bounds } from "../typedefs";
import { Artboard } from "./artboard";
import { SceneNode } from "./sceneNode";

// TODO: Selection
export class Selection {
  constructor() {
    makeAutoObservable(this);
  }
  get items(): SceneNode[] {
    return this.itemsIncludingLocked.filter((v) => !v.locked);
  }

  set items(value: SceneNode[]) {
    this.itemsIncludingLocked = value;
  }

  itemsIncludingLocked: SceneNode[] = [];
  get hasArtwork(): boolean {
    return (
      this.items.length !== 0 &&
      this.items.every((v) => !(v instanceof Artboard))
    );
  }
  get hasArtboards(): boolean {
    return (
      this.items.length !== 0 && this.items.some((v) => v instanceof Artboard)
    );
  }
  // TODO:
  insertionParent: SceneNode | null = null;
  focusedArtboard: Artboard | null = null;
  editContext: SceneNode | null = null;
  isInEditContext(node: SceneNode): boolean {
    // TODO:
    return false;
  }

  get globalBounds(): Bounds | null {
    if (!this.items.length) return null;
    if (this.items.length === 1) return this.items[0].globalBounds;
    let rectList: Bounds[] = [];
    this.items.forEach((v) => {
      let d = {
        x: v.globalBounds.x,
        y: v.globalBounds.y,
        width: v.globalBounds.width,
        height: v.globalBounds.height,
      };
      rectList.push(d);
    });
    const res = rectList.reduce((a, b) => {
      let x = Math.min(a.x, b.x);
      let y = Math.min(a.y, b.y);
      let width = Math.max(a.x + a.width - x, b.x + b.width - x);
      let height = Math.max(a.y + a.height - y, b.y + b.height - y);
      return { x, y, width, height };
    });
    return res;
  }

  get boundsInParent(): Bounds | null {
    if (!this.items.length) return null;
    if (this.items.length === 1) return this.items[0].boundsInParent;
    let rectList: Bounds[] = [];
    this.items.forEach((v) => {
      const bounds = v.boundsInParent;
      let d = {
        x: bounds.x,
        y: bounds.y,
        width: bounds.width,
        height: bounds.height,
      };
      rectList.push(d);
    });
    const res = rectList.reduce((a, b) => {
      let x = Math.min(a.x, b.x);
      let y = Math.min(a.y, b.y);
      let width = Math.max(a.x + a.width - x, b.x + b.width - x);
      let height = Math.max(a.y + a.height - y, b.y + b.height - y);
      return { x, y, width, height };
    });
    return res;
  }
}
