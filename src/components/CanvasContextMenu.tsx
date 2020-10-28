import { Divider } from "@adobe/react-spectrum";
import React from "react";
import { ContextMenu, MenuItem } from "react-contextmenu";
import styled from "../styles/styled";

const Root = styled(ContextMenu)`
  display: flex;
  flex-direction: column;
  font-size: 12px;
  width: 240px;
  background-color: ${({ theme }) => theme.palette.background.default};
  border-radius: 6px;
  border: 1px solid #ddd;
  box-shadow: 0px 5px 14px 0px rgba(140, 140, 140, 0.6);
`;

const Item = styled(MenuItem)`
  display: flex;
  justify-content: space-between;
  cursor: ${({ disabled }) => (disabled ? "not-allowed" : "pointer")};
  align-items: center;
  height: 28px;
  padding: 0 15px;

  opacity: ${({ disabled }) => (disabled ? 0.7 : 1)};

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.hover};
  }
`;

const CanvasContextMenu = () => {
  return (
    <Root id="canvas_menu">
      <Item disabled>
        <div>Undo</div>
        <div>Ctrl + Z</div>
      </Item>
      <Item disabled>
        <div>Redo</div>
        <div>Shift + Ctrl + Z</div>
      </Item>
      <Divider size="S" marginY={3} />
      <Item disabled>
        <div>Paste</div>
        <div>Ctrl + V</div>
      </Item>
    </Root>
  );
};

export default CanvasContextMenu;
