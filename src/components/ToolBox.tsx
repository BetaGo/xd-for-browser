import ArtboardIcon from "@spectrum-icons/workflow/Artboard";
import EllipseIcon from "@spectrum-icons/workflow/Ellipse";
import LayersIcon from "@spectrum-icons/workflow/Layers";
import LineIcon from "@spectrum-icons/workflow/Line";
import AssetsIcon from "@spectrum-icons/workflow/PaddingTop";
import PolygonIcon from "@spectrum-icons/workflow/Polygon";
import RectangleIcon from "@spectrum-icons/workflow/Rectangle";
import ZoomIcon from "@spectrum-icons/workflow/Search";
import SelectIcon from "@spectrum-icons/workflow/Select";
import TextIcon from "@spectrum-icons/workflow/Text";
import VectorDrawIcon from "@spectrum-icons/workflow/VectorDraw";
import { runInAction } from "mobx";
import { observer } from "mobx-react";
import React from "react";

import { DesignTool, OtherTool } from "../constants";
import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";

const Root = styled.div`
  cursor: pointer;
  width: 48px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const ToolItem = styled.div<{ active: boolean }>`
  width: 48px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: ${({ theme, active }) => active && theme.palette.icon.informative};
`;

const designToolsData = [
  {
    name: "Select",
    value: DesignTool.Select,
    icon: <SelectIcon size="S" />,
  },
  {
    name: "Rectangle",
    value: DesignTool.Rectangle,
    icon: <RectangleIcon size="S" />,
  },
  {
    name: "Ellipse",
    value: DesignTool.Ellipse,
    icon: <EllipseIcon size="S" />,
  },
  {
    name: "Polygon",
    value: DesignTool.Polygon,
    icon: <PolygonIcon size="S" />,
  },
  {
    name: "Line",
    value: DesignTool.Line,
    icon: <LineIcon size="S" />,
  },
  {
    name: "Pen",
    value: DesignTool.Pen,
    icon: <VectorDrawIcon size="S" />,
  },
  {
    name: "Text",
    value: DesignTool.Text,
    icon: <TextIcon size="S" />,
  },
  {
    name: "Artboard",
    value: DesignTool.Artboard,
    icon: <ArtboardIcon size="S" />,
  },
  {
    name: "Zoom",
    value: DesignTool.Zoom,
    icon: <ZoomIcon size="S" />,
  },
];

const otherToolsData = [
  {
    name: "Assets",
    value: OtherTool.Assets,
    icon: <AssetsIcon size="S" />,
  },
  {
    name: "Layers",
    value: OtherTool.Layers,
    icon: <LayersIcon size="S" />,
  },
];

const ToolBox = () => {
  const { uiStore } = useStores();
  return (
    <Root>
      <div>
        {designToolsData.map((v) => (
          <ToolItem
            onClick={() => {
              runInAction(() => {
                uiStore.selectedDesignTool = v.value;
              });
            }}
            active={v.value === uiStore.selectedDesignTool}
            key={v.name}
          >
            {v.icon}
          </ToolItem>
        ))}
      </div>
      <div>
        {otherToolsData.map((v) => (
          <ToolItem
            onClick={() => {
              runInAction(() => {
                if (v.value === uiStore.selectedOtherTool) {
                  uiStore.selectedOtherTool = undefined;
                } else {
                  uiStore.selectedOtherTool = v.value;
                }
              });
            }}
            active={v.value === uiStore.selectedOtherTool}
            key={v.name}
          >
            {v.icon}
          </ToolItem>
        ))}
      </div>
    </Root>
  );
};

export default observer(ToolBox);
