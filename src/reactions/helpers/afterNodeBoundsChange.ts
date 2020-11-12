import { globalStores } from "../../contexts";
import { isRectOverlap } from "../../utils/geometry";
import { Artboard } from "../../xd/scenegraph/artboard";
import { SceneNode } from "../../xd/scenegraph/sceneNode";
import { getBoundingRectPoints, moveNode } from "../../xd/sceneNode.helpers";
import _ from "lodash";

const { canvasStore } = globalStores;

const _afterBoundsChange = (current: SceneNode) => {
  if (current.parent instanceof Artboard) {
    let artboard = current.parent;
    const artboardRectPath = getBoundingRectPoints(
      artboard.localBounds,
      artboard.globalTransform
    );
    const currentRectPath = getBoundingRectPoints(
      current.localBounds,
      current.globalTransform
    );

    if (isRectOverlap(artboardRectPath, currentRectPath)) {
      return;
    }
  }

  const elementParentArtboardMap: WeakMap<
    SceneNode,
    Artboard[]
  > = new WeakMap();

  canvasStore.artboards.forEach((artboard) => {
    const artboardRectPath = getBoundingRectPoints(
      artboard.localBounds,
      artboard.globalTransform
    );
    const currentRectPath = getBoundingRectPoints(
      current.localBounds,
      current.globalTransform
    );
    if (isRectOverlap(artboardRectPath, currentRectPath)) {
      const parents = elementParentArtboardMap.get(current) || [];
      parents.push(artboard);
      elementParentArtboardMap.set(current, parents);
    }
  });
  let parents = elementParentArtboardMap.get(current);
  if (!parents || parents.length === 0) {
    let rootNode = canvasStore.gRender?.rootNode;
    if (!rootNode) return;
    moveNode(current, rootNode);
  } else {
    if (
      !(current.parent instanceof Artboard && parents.includes(current.parent))
    ) {
      moveNode(current, parents[0]);
    }
  }
};

export const afterBoundsChange = _.debounce(_afterBoundsChange, 100);
