import { createDrawRectReaction } from "./drawRectangle";
import { createMoveElementsReaction } from "./moveElements";
import { createPanCanvasReaction } from "./panCanvas";
import { createSelectElementsReaction } from "./selectElements";
import { globalStores } from "../contexts";

const runReaction = () => {
  const drawRectReaction = createDrawRectReaction();
  const moveElementsReaction = createMoveElementsReaction();
  const panCanvasReaction = createPanCanvasReaction();
  const selectElements = createSelectElementsReaction();
  return {
    drawRectReaction,
    moveElementsReaction,
    panCanvasReaction,
    selectElements,
  };
};

globalStores.canvasStore.runAfterInitRender(runReaction);
