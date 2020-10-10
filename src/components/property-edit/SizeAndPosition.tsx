import React, { useEffect, useState } from "react";
import styled from "../../styles/styled";
import { observer, useLocalObservable } from "mobx-react";
import { useStores } from "../../hooks/useStores";
import { IBoundingRect } from "../../draw/shape";
import { IElementEvent } from "../../draw/events";
import { degree2Radian, radian2Degree } from "../../draw/utils";
import { observable, runInAction } from "mobx";
import _ from "lodash";

import Input from "../common/Input";

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
  // const [boundingRect, setBoundingRect] = useState(() => {
  //   return observable({
  //     x: '0',
  //     y: '0',
  //     width: '0',
  //     height: '0',
  //     rotate: '0',

  //     update(k: string, v: string) {
  //       _.set()
  //     }
  //   });
  // });

  useEffect(() => {
    const handleBoundingChange = (e: IElementEvent) => {
      const boundingBox = e.target.getBoundingBox().getTransformed();

      runInAction(() => {
        boundingRectInput.x = boundingBox.x.toString();
        boundingRectInput.y = boundingBox.y.toString();
        boundingRectInput.width = boundingBox.width.toString();
        boundingRectInput.height = boundingBox.height.toString();
        boundingRectInput.rotate = radian2Degree(boundingBox.rotate).toString();
      });
      // setBoundingRect(e.target.getBoundingBox().getTransformed());
    };
    if (selectedElement) {
      const boundingBox = selectedElement.getBoundingBox().getTransformed();

      runInAction(() => {
        boundingRectInput.x = boundingBox.x.toString();
        boundingRectInput.y = boundingBox.y.toString();
        boundingRectInput.width = boundingBox.width.toString();
        boundingRectInput.height = boundingBox.height.toString();
        boundingRectInput.rotate = radian2Degree(boundingBox.rotate).toString();
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
        onChange={(e) => boundingRectInput.update("w", e)}
      />
      <Input
        label="H"
        isQuiet
        autoSelect
        value={boundingRectInput.height.toString()}
        onChange={(e) => boundingRectInput.update("h", e)}
      />
      <Input
        label="X"
        isQuiet
        autoSelect
        value={boundingRectInput.x.toString()}
        onChange={(e) => boundingRectInput.update("x", e)}
      />
      <Input
        label="Y"
        isQuiet
        autoSelect
        value={boundingRectInput.y.toString()}
        onChange={(e) => boundingRectInput.update("y", e)}
      />
      <Input
        label="R"
        isQuiet
        autoSelect
        value={boundingRectInput.rotate.toString()}
        onChange={(e) => {
          boundingRectInput.update("rotate", e);
        }}
        onBlur={(e) => {
          const r = Number(boundingRectInput.rotate);
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
