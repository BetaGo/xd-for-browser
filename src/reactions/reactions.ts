import { createDrawRectReaction } from "./drawRectangle";
import { createMoveElementsReaction } from "./moveElements";
import { createPanCanvasReaction } from "./panCanvas";
import { createSelectElementsReaction } from "./selectElements";
import { createDrawEllipseReaction } from "./drawEllipse";
import { globalStores } from "../contexts";

const runReaction = () => {
  const drawRectReaction = createDrawRectReaction();
  const moveElementsReaction = createMoveElementsReaction();
  const panCanvasReaction = createPanCanvasReaction();
  const selectElements = createSelectElementsReaction();
  const drawEllipseReaction = createDrawEllipseReaction();
  return {
    drawRectReaction,
    moveElementsReaction,
    panCanvasReaction,
    selectElements,
    drawEllipseReaction,
  };
};

globalStores.canvasStore.runAfterInitRender(runReaction);
