import { Divider } from "@adobe/react-spectrum";
import ShowMenuIcon from "@spectrum-icons/workflow/ShowMenu";
import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../hooks/useStores";
import styled from "../styles/styled";

const MenuDrawerRoot = styled.div`
  display: ${(props) => (props.hidden ? "none" : "block")};
  position: fixed;
  z-index: 9999;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  transform: translateX(-100%);
  transition: transform 0.2s ease;
  &.show {
    transform: translateX(0);
  }
`;

const MenuDrawer = styled.div`
  display: flex;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  font-size: 12px;
  /* color: #000; */
  background-color: ${({ theme }) => theme.palette.background.default};
`;

const ListRoot = styled.div`
  display: flex;
  flex-direction: column;
  width: 285px;
  height: 100%;
`;

const ListItem = styled.div`
  display: flex;
  justify-content: space-between;
  cursor: pointer;
  align-items: center;
  height: 40px;
  padding: 0 15px;

  &:hover {
    background-color: ${({ theme }) => theme.palette.background.hover};
  }
`;

const ListHeader = styled.div`
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 40px;
  margin-bottom: 10px;
`;

const ListContent = styled.div`
  flex: 1;
  overflow: auto;
`;

const MenuButtonWrapper = styled.div`
  display: inherit;
`;

const Menu = () => {
  const { uiStore, projectStore } = useStores();
  return (
    <>
      <MenuButtonWrapper
        onClick={() => {
          uiStore.showMenuDrawer = !uiStore.showMenuDrawer;
        }}
      >
        <ShowMenuIcon size="S" />
      </MenuButtonWrapper>

      <MenuDrawerRoot
        className={uiStore.showMenuDrawer ? "show" : ""}
        onClick={() => {
          uiStore.showMenuDrawer = false;
        }}
      >
        <MenuDrawer onClick={(e) => e.stopPropagation()}>
          <ListRoot>
            <ListHeader>
              <MenuButtonWrapper
                onClick={() =>
                  (uiStore.showMenuDrawer = !uiStore.showMenuDrawer)
                }
              >
                <ShowMenuIcon size="S" />
              </MenuButtonWrapper>
            </ListHeader>
            <ListContent>
              <ListItem onClick={() => window.open(window.location.origin)}>
                <div>New</div>
                <div>Ctrl + N</div>
              </ListItem>
              <ListItem
                onClick={() => {
                  projectStore.loadXDFile();
                }}
              >
                <div>Open</div>
                <div>Ctrl + O</div>
              </ListItem>
              <ListItem>
                <div>Rename your document</div>
              </ListItem>
            </ListContent>
          </ListRoot>
          <Divider orientation="vertical" size="M" />
        </MenuDrawer>
      </MenuDrawerRoot>
    </>
  );
};

export default observer(Menu);
