import { reaction } from "mobx";

import { DesignTool } from "../constants";
import { globalStores } from "../contexts";
import { Artboard } from "../draw/elements/artboard";
import { isRectOverlap } from "../utils/geometry";
import { Matrix } from "../xd/scenegraph/matrix";
import { SceneNode } from "../xd/scenegraph/sceneNode";
import { boundsToRectPath } from "../xd/sceneNode.helper";

const { uiStore, canvasStore, canvasMouseStore } = globalStores;

export const createMoveElementsReaction = () => {
  let transformList: Matrix[] = [];
  let transformMap: WeakMap<Matrix, SceneNode> = new WeakMap();
  return reaction(
    () => {
      return {
        selectedDesignTool: uiStore.selectedDesignTool,
        selectedElements: canvasStore.selectedElements,
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
        !d.selectedElements.size ||
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
            const artboardRectPath = boundsToRectPath(
              artboard.globalBounds,
              artboard.rotation
            );
            const currentRectPath = boundsToRectPath(
              current.globalBounds,
              current.rotation
            );
            if (isRectOverlap(artboardRectPath, currentRectPath)) {
              const parents = elementParentArtboardMap.get(current) || [];
              parents.push(artboard);
              elementParentArtboardMap.set(current, parents);
            }
          });
          let parents = elementParentArtboardMap.get(current);
          if (!parents || parents.length === 0) {
            current.removeFromParent();
            canvasStore.gRender?.rootNode.addChild(current);
          } else {
            if (
              !(
                current.parent instanceof Artboard &&
                parents.includes(current.parent)
              )
            ) {
              current.removeFromParent();
              parents[0].addChild(current);
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
          let transformSnapShort = v.transform.clone();
          transformMap.set(transformSnapShort, v);
          return transformSnapShort;
        });
      }

      if (
        Math.abs(currentMouseX - mouseDownX!) > Number.EPSILON ||
        Math.abs(currentMouseY - mouseDownY!) > Number.EPSILON
      ) {
        transformList.forEach((transform) => {
          const dx = mouseDownX! - transform.e;
          const dy = mouseDownY! - transform.f;

          const targetX = currentMouseX - dx;
          const targetY = currentMouseY - dy;
          const currentElement = transformMap.get(transform);
          if (currentElement) {
            currentElement.transform.e = targetX;
            currentElement.transform.f = targetY;
          }
        });

        canvasStore.render();
      }
    }
  );
};
