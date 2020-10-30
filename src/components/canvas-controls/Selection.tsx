import { observer } from "mobx-react";
import React from "react";

import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";

const Root = styled.div`
  position: absolute;
  border: 1px solid #fff;
  overflow: hidden;

  &::after {
    content: "";
    display: block;
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.palette.primary};
    opacity: 0.2;
  }
`;

const Selection = () => {
  const { uiStore } = useStores();

  const { selectionRect } = uiStore;

  return (
    <Root
      hidden={!selectionRect.show}
      style={{
        left: selectionRect.left,
        top: selectionRect.top,
        width: selectionRect.width,
        height: selectionRect.height,
      }}
    ></Root>
  );
};

export default observer(Selection);
