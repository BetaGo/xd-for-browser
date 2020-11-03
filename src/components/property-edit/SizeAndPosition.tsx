import { observer } from "mobx-react";
import React, { useEffect, useState } from "react";

import { Rectangle } from "../../draw/elements/rectangle";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";
import { getValueFromEvent } from "../../utils/form";
import Input from "../common/Input";

const Root = styled.div``;

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
    const bounds = canvasStore.selection.globalBounds;
    if (bounds) {
      d.x = bounds.x;
      d.y = bounds.y;
    }
    const selectedItems = canvasStore.selection.items;
    if (selectedItems.length === 1) {
      let bounds = selectedItems[0].globalBounds;
      d.w = bounds.width;
      d.h = bounds.height;
      d.r = selectedItems[0].rotation;
    }
    if (selectedItems.length > 1) {
      const firstElement = selectedItems[0];
      const firstBounds = firstElement.globalBounds;
      let w: number | string = firstBounds.width;
      let h: number | string = firstBounds.height;
      let r: number | string = firstElement.rotation;
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
  }, [canvasStore.selection.globalBounds, canvasStore.selection.items]);

  const handleUpdate = (name: string) => (e: React.FocusEvent) => {
    const v = Number(getValueFromEvent(e));
    if (Number.isNaN(v)) {
      setData({ ...data });
      return;
    }
    switch (name) {
      case "x": {
        const dx = v - (canvasStore.selection.globalBounds?.x ?? 0);
        canvasStore.selection.items.forEach((item) => (item.transform.e += dx));
        break;
      }
      case "y": {
        const dy = v - (canvasStore.selection.globalBounds?.y ?? 0);
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
        // const r = v % 360;
        // TODO: rotate each node
        break;
      }
    }
    canvasStore.render();
  };
  return (
    <Root>
      <Input
        label="W"
        isQuiet
        autoSelect
        value={data.w.toString()}
        onChange={(e) => {
          setData({ ...data, w: e });
        }}
        onBlur={handleUpdate("w")}
      />
      <Input
        label="H"
        isQuiet
        autoSelect
        value={data.h.toString()}
        onChange={(e) => {
          setData({ ...data, h: e });
        }}
        onBlur={handleUpdate("h")}
      />
      <Input
        label="X"
        isQuiet
        autoSelect
        value={data.x.toString()}
        onChange={(e) => {
          setData({ ...data, x: e });
        }}
        onBlur={handleUpdate("x")}
      />
      <Input
        label="Y"
        isQuiet
        autoSelect
        value={data.y.toString()}
        onChange={(e) => {
          setData({ ...data, y: e });
        }}
        onBlur={handleUpdate("y")}
      />
      <Input
        label="R"
        isQuiet
        autoSelect
        value={data.r.toString()}
        onChange={(e) => {
          setData({ ...data, r: e });
        }}
        onBlur={handleUpdate("r")}
        addonAfter="°"
      />
    </Root>
  );
};

export default observer(SizeAndPosition);
