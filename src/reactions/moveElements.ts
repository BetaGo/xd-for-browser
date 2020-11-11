import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Artboard } from "../draw/elements/artboard";
import { isRectOverlap } from "../utils/geometry";
import { Matrix } from "../xd/scenegraph/matrix";
import { SceneNode } from "../xd/scenegraph/sceneNode";
import { getBoundingRectPoints, moveNode } from "../xd/sceneNode.helpers";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createMoveElementsReaction = () => {
  let transformList: Matrix[] = [];
  let transformMap: WeakMap<Matrix, SceneNode> = new WeakMap();
  return reaction(
    () => {
      return {
        selectedDesignTool: uiStore.selectedDesignTool,
        selectedElements: canvasStore.selection.items,
        mouseDownX: canvasMouseStore.mouseDownX,
        mouseDownY: canvasMouseStore.mouseDownY,
        currentMouseX: canvasMouseStore.currentMouseX,
        currentMouseY: canvasMouseStore.currentMouseY,
        isMainButtonDown: canvasMouseStore.isMainButtonDown,
      };
    },
    (d) => {
      if (
        d.selectedDesignTool !== DesignTool.Select ||
        !d.selectedElements.length ||
        !d.isMainButtonDown ||
        uiStore.selectionRect.show
      ) {
        if (!transformList.length) {
          return;
        }
        const elementParentArtboardMap: WeakMap<
          SceneNode,
          Artboard[]
        > = new WeakMap();
        transformList.forEach((v) => {
          const current = transformMap.get(v);
          if (!current) {
            return;
          }
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
              !(
                current.parent instanceof Artboard &&
                parents.includes(current.parent)
              )
            ) {
              moveNode(current, parents[0]);
            }
          }
          transformMap.delete(v);
        });
        transformList = [];
        return;
      }

      const {
        mouseDownX,
        mouseDownY,
        currentMouseX,
        currentMouseY,
        selectedElements,
      } = d;
      if (!transformList.length) {
        transformList = [...selectedElements].map((v) => {
          let transformSnapShort = v.globalTransform.clone();
          transformMap.set(transformSnapShort, v);
          return transformSnapShort;
        });
      }

      if (
        Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
        Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
      ) {
        transformList.forEach((transform) => {
          const currentElement = transformMap.get(transform);
          if (currentElement) {
            const dx = mouseDownX! - transform.e;
            const dy = mouseDownY! - transform.f;
            const targetX =
              currentMouseX - dx - (currentElement.parent?.transform.e ?? 0);
            const targetY =
              currentMouseY - dy - (currentElement.parent?.transform.f ?? 0);
            currentElement.transform.e = targetX;
            currentElement.transform.f = targetY;
          }
        });

        canvasStore.render();
      }
    }
  );
};
