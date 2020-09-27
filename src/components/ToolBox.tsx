import styled from "@emotion/styled";
import React, { useState } from "react";
import SelectIcon from "@spectrum-icons/workflow/Select";
import RectangleIcon from "@spectrum-icons/workflow/Rectangle";
import EllipseIcon from "@spectrum-icons/workflow/Ellipse";
import PolygonIcon from "@spectrum-icons/workflow/Polygon";
import LineIcon from "@spectrum-icons/workflow/Line";
import VectorDrawIcon from "@spectrum-icons/workflow/VectorDraw";
import TextIcon from "@spectrum-icons/workflow/Text";
import ArtboardIcon from "@spectrum-icons/workflow/Artboard";
import ZoomIcon from "@spectrum-icons/workflow/Search";
import LayersIcon from "@spectrum-icons/workflow/Layers";
import AssetsIcon from "@spectrum-icons/workflow/PaddingTop";

const Root = styled.div`
  width: 48px;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

const ToolItem = styled.div`
  width: 48px;
  height: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: rgb(101, 101, 101);
  &.active {
    color: rgb(20, 145, 229);
  }
`;

const designToolsData = [
  {
    name: "Select",
    icon: <SelectIcon size="S" />,
  },
  {
    name: "Rectangle",
    icon: <RectangleIcon size="S" />,
  },
  {
    name: "Ellipse",
    icon: <EllipseIcon size="S" />,
  },
  {
    name: "Polygon",
    icon: <PolygonIcon size="S" />,
  },
  {
    name: "Line",
    icon: <LineIcon size="S" />,
  },
  {
    name: "Pen",
    icon: <VectorDrawIcon size="S" />,
  },
  {
    name: "Text",
    icon: <TextIcon size="S" />,
  },
  {
    name: "Artboard",
    icon: <ArtboardIcon size="S" />,
  },
  {
    name: "Zoom",
    icon: <ZoomIcon size="S" />,
  },
];

const otherToolsData = [
  {
    name: "Assets",
    icon: <AssetsIcon size="S" />,
  },
  {
    name: "Layers",
    icon: <LayersIcon size="S" />,
  },
];

const ToolBox = () => {
  const [selectedDesignTool, setSelectedDesignTool] = useState("Select");
  const [selectedOtherTool, setSelectedOtherTool] = useState("Select");
  return (
    <Root>
      <div>
        {designToolsData.map((v) => (
          <ToolItem
            onClick={() => {
              setSelectedDesignTool(v.name);
            }}
            className={v.name === selectedDesignTool ? "active" : ""}
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
              if (v.name === selectedOtherTool) {
                setSelectedOtherTool("");
              } else {
                setSelectedOtherTool(v.name);
              }
            }}
            className={v.name === selectedOtherTool ? "active" : ""}
            key={v.name}
          >
            {v.icon}
          </ToolItem>
        ))}
      </div>
    </Root>
  );
};

export default ToolBox;
