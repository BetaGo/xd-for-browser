import _ from "lodash";
import { runInAction } from "mobx";
import { observer, useLocalObservable } from "mobx-react";
import React, { useEffect } from "react";

import { IElementEvent } from "../../draw/events";
import { degree2Radian, radian2Degree } from "../../draw/utils";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import Input from "../common/Input";
import { fRound } from "../../utils/number";

const Root = styled.div``;

const SizeAndPosition = () => {
  const { canvasStore } = useStores();
  const selectedElement = canvasStore.selectedElement;

  const boundingRectInput = useLocalObservable(() => ({
    x: "0",
    y: "0",
    width: "0",
    height: "0",
    rotate: "0",

    update(k: string, v: string) {
      _.set(this, k, v);
    },
  }));

  useEffect(() => {
    const handleBoundingChange = (e: IElementEvent) => {
      const boundingBox = e.target.getBoundingBox().getTransformed();

      runInAction(() => {
        boundingRectInput.x = fRound(boundingBox.x).toString();
        boundingRectInput.y = fRound(boundingBox.y).toString();
        boundingRectInput.width = fRound(boundingBox.width).toString();
        boundingRectInput.height = fRound(boundingBox.height).toString();
      });
    };
    if (selectedElement) {
      const boundingBox = selectedElement.getBoundingBox().getTransformed();

      runInAction(() => {
        boundingRectInput.x = fRound(boundingBox.x).toString();
        boundingRectInput.y = fRound(boundingBox.y).toString();
        boundingRectInput.width = fRound(boundingBox.width).toString();
        boundingRectInput.height = fRound(boundingBox.height).toString();
      });
      selectedElement.on("boundingChange", handleBoundingChange);
      return () => {
        selectedElement?.off("boundingChange", handleBoundingChange);
      };
    }
  }, [boundingRectInput, selectedElement]);

  return (
    <Root>
      <Input
        label="W"
        isQuiet
        autoSelect
        value={boundingRectInput.width.toString()}
        onChange={(e) => boundingRectInput.update("width", e)}
        onBlur={(e) => {
          const v = fRound(Number(boundingRectInput.width) || 0);
          selectedElement?.setBounding("width", v);
          canvasStore.render();
        }}
      />
      <Input
        label="H"
        isQuiet
        autoSelect
        value={boundingRectInput.height.toString()}
        onChange={(e) => boundingRectInput.update("height", e)}
        onBlur={(e) => {
          const v = fRound(Number(boundingRectInput.height) || 0);
          selectedElement?.setBounding("height", v);
          canvasStore.render();
        }}
      />
      <Input
        label="X"
        isQuiet
        autoSelect
        value={boundingRectInput.x.toString()}
        onChange={(e) => boundingRectInput.update("x", e)}
        onBlur={(e) => {
          const v = fRound(Number(boundingRectInput.x) || 0);
          selectedElement?.setBounding("x", v);
          canvasStore.render();
        }}
      />
      <Input
        label="Y"
        isQuiet
        autoSelect
        value={boundingRectInput.y.toString()}
        onChange={(e) => boundingRectInput.update("y", e)}
        onBlur={(e) => {
          const v = fRound(Number(boundingRectInput.y) || 0);
          selectedElement?.setBounding("y", v);
          canvasStore.render();
        }}
      />
      <Input
        label="R"
        isQuiet
        autoSelect
        value={radian2Degree(selectedElement?.rotation || 0).toString()}
        onChange={(e) => {
          boundingRectInput.update("rotate", e);
        }}
        onBlur={(e) => {
          const r = fRound(Number(boundingRectInput.rotate) % 360 || 0);
          boundingRectInput.update("rotate", r.toString());
          const radian = degree2Radian(r);
          selectedElement?.setRotate(radian);
          canvasStore.render();
        }}
        addonAfter="°"
      />
    </Root>
  );
};

export default observer(SizeAndPosition);
