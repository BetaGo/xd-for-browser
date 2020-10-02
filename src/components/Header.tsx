import styled from "@emotion/styled";
import HomeIcon from "@spectrum-icons/workflow/Home";
import React from "react";
import { NavLink } from "react-router-dom";

import Menu from "./Menu";

const Root = styled.div`
  width: 100%;
  height: 40px;
  font-size: 13px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  color: rgba(0, 0, 0, 0.6);
`;

const LeftActions = styled.div`
  grid-column: 1 / 2;
  grid-row: 1;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  height: 100%;
`;

const LeftActionItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  margin: 0 16px;
`;

const CenterActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  grid-column: 2 / 3;
  grid-row: 1;
`;

const RightActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  grid-column: 3 / 4;
  grid-row: 1;
`;

const NavItem = styled(NavLink)`
  color: rgba(0, 0, 0, 0.5);
  position: relative;
  height: 100%;
  box-sizing: border-box;
  text-decoration: none;
  line-height: 40px;

  &.active {
    color: #000;
  }
  &.active::before {
    content: " ";
    display: block;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 2px;
    width: 100%;
    background: #000;
  }
`;

const Header = () => {
  return (
    <Root>
      <LeftActions>
        <LeftActionItem>
          <Menu />
        </LeftActionItem>
        <LeftActionItem onClick={() => window.open(window.location.origin)}>
          <HomeIcon size="S" />
        </LeftActionItem>
        <LeftActionItem>
          <NavItem to="/design" activeClassName="active">
            Design
          </NavItem>
        </LeftActionItem>
        <LeftActionItem>
          <NavItem to="/prototype" activeClassName="active">
            Prototype
          </NavItem>
        </LeftActionItem>
        <LeftActionItem>
          <NavItem to="/share" activeClassName="active">
            Share
          </NavItem>
        </LeftActionItem>
      </LeftActions>
      <CenterActions>XD Tutorial</CenterActions>
      <RightActions>6.3%</RightActions>
    </Root>
  );
};

export default Header;
