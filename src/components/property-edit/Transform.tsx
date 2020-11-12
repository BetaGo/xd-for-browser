import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";
import RotateIcon from "@spectrum-icons/workflow/RotateCW";

import { Rectangle } from "../../draw/elements/rectangle";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { getValueFromEvent } from "../../utils/form";
import Input from "../common/Input";
import { fRound } from "../../utils/number";

const Root = styled.div``;

const Title = styled.div`
  color: ${({ theme }) => theme.palette.text.label};
  margin: 5px 10px;
`;

const LabelText = styled.span`
  width: 10px;
  text-align: left;
`;

const InputRow = styled.div`
  display: flex;
  align-items: flex-start;
  font-size: 12px;

  & input {
    font-size: 12px;
  }
`;

const SizeAndPosition = () => {
  const { canvasStore } = useStores();
  const [data, setData] = useState<Record<string, number | string>>({
    x: 0,
    y: 0,
    w: 0,
    h: 0,
    r: 0,
  });

  useEffect(() => {
    let d: Record<string, string | number> = {
      x: 0,
      y: 0,
      w: 0,
      h: 0,
      r: 0,
    };
    const selectedItems = canvasStore.selection.items;
    if (selectedItems.length === 1) {
      let selectedItem = selectedItems[0];
      let bounds = selectedItem.globalBounds;
      d.x = fRound(selectedItem.transform.e);
      d.y = fRound(selectedItem.transform.f);
      d.w = fRound(bounds.width);
      d.h = fRound(bounds.height);
      d.r = fRound(selectedItem.rotation);
    }
    if (selectedItems.length > 1) {
      const bounds = canvasStore.selection.globalBounds;
      if (bounds) {
        let parentTransform =
          canvasStore.selection.insertionParent?.globalTransform;
        d.x = fRound(bounds.x - (parentTransform?.e ?? 0));
        d.y = fRound(bounds.y - (parentTransform?.f ?? 0));
      }
      const firstElement = selectedItems[0];
      const firstBounds = firstElement.globalBounds;
      let w: number | string = fRound(firstBounds.width, 2);
      let h: number | string = fRound(firstBounds.height, 2);
      let r: number | string = fRound(firstElement.rotation, 2);
      for (let i = 1; i < selectedItems.length; i++) {
        const current = selectedItems[i];
        const currentBounds = current.globalBounds;
        if (w !== currentBounds.width) {
          w = "-";
        }
        if (h !== currentBounds.height) {
          h = "-";
        }
        if (r !== current.rotation) {
          r = "-";
        }
      }
      d.w = w;
      d.h = h;
      d.r = r;
    }
    setData(d);
  }, [
    canvasStore.selection.globalBounds,
    canvasStore.selection.items,
    canvasStore.selection.insertionParent,
  ]);

  const handleUpdate = (name: string) => (e: React.FocusEvent) => {
    const v = Number(getValueFromEvent(e));
    if (Number.isNaN(v)) {
      setData({ ...data });
      return;
    }
    switch (name) {
      case "x": {
        const dx = v - (Number(data.x) || 0);
        canvasStore.selection.items.forEach((item) => (item.transform.e += dx));
        break;
      }
      case "y": {
        const dy = v - (Number(data.y) || 0);
        canvasStore.selection.items.forEach((item) => (item.transform.f += dy));
        break;
      }
      case "w": {
        canvasStore.selection.items.forEach((item) => {
          if (item instanceof Rectangle) {
            item.width = v;
          }
          // TODO: other type node
        });
        break;
      }
      case "h": {
        canvasStore.selection.items.forEach((item) => {
          if (item instanceof Rectangle) {
            item.height = v;
          }
          // TODO: other type node
        });
        break;
      }
      case "r": {
        const r = v % 360;
        canvasStore.selection.items.forEach((item) => {
          item.rotateAround(r - item.rotation, item.localCenterPoint);
        });
        break;
      }
    }
    canvasStore.render();
  };
  return (
    <Root>
      <Title>TRANSFORM</Title>
      <InputRow>
        <Input
          label={<LabelText>W</LabelText>}
          labelPosition="side"
          isQuiet
          autoSelect
          value={data.w.toString()}
          // onChange={(e) => {
          //   setData({ ...data, w: e });
          // }}
          onBlur={handleUpdate("w")}
          width={50}
          marginX={10}
          marginEnd={15}
        />

        <Input
          label={<LabelText>H</LabelText>}
          labelPosition="side"
          isQuiet
          autoSelect
          value={data.h.toString()}
          // onChange={(e) => {
          //   setData({ ...data, h: e });
          // }}
          onBlur={handleUpdate("h")}
          width={50}
          marginX={10}
          marginEnd={15}
        />
        <Input
          label={<RotateIcon size="S" />}
          labelPosition="side"
          isQuiet
          autoSelect
          value={data.r.toString()}
          // onChange={(e) => {
          //   setData({ ...data, r: e });
          // }}
          onBlur={handleUpdate("r")}
          addonAfter="°"
          width={50}
          marginX={10}
          marginEnd={15}
        />
      </InputRow>

      <InputRow>
        <Input
          label={<LabelText>X</LabelText>}
          labelPosition="side"
          isQuiet
          autoSelect
          value={data.x.toString()}
          // onChange={(e) => {
          //   setData({ ...data, x: e });
          // }}
          onBlur={handleUpdate("x")}
          width={50}
          marginX={10}
          marginEnd={15}
        />
        <Input
          label={<LabelText>Y</LabelText>}
          labelPosition="side"
          isQuiet
          autoSelect
          value={data.y.toString()}
          // onChange={(e) => {
          //   setData({ ...data, y: e });
          // }}
          onBlur={handleUpdate("y")}
          width={50}
          marginX={10}
          marginEnd={15}
        />
      </InputRow>
    </Root>
  );
};

export default observer(SizeAndPosition);
