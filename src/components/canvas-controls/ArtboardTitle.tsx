import { observer } from "mobx-react";
import React, { useState } from "react";

import { Artboard } from "../../draw/elements/artboard";
import { useStores } from "../../hooks/useStores";
import styled from "../../styles/styled";

interface IArtboardTitleProps {
  artboard: Artboard;
}

const Root = styled.div`
  pointer-events: all;
  position: absolute;
  transform: translateY(-100%);
`;

const ArtboardTitle: React.FC<IArtboardTitleProps> = ({ artboard }) => {
  const { canvasStore } = useStores();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(artboard.name);

  const dpr = canvasStore.dpr;
  const scale = canvasStore.zoomValue;
  const { e, f } = canvasStore.transform || {};
  const style: React.CSSProperties = {
    top: artboard.globalBounds.y * scale + (f ?? 0) / dpr,
    left: artboard.globalBounds.x * scale + (e ?? 0) / dpr,
  };
  return (
    <Root
      style={style}
      onDoubleClick={() => {
        setIsEditing(true);
      }}
    >
      {isEditing ? (
        <input
          onBlur={() => {
            setIsEditing(false);
            if (name.trim()) {
              artboard.name = name;
            } else {
              setName(artboard.name);
            }
          }}
          autoFocus
          onFocus={(e) => {
            e.target.select();
          }}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      ) : (
        name
      )}
    </Root>
  );
};

export default observer(ArtboardTitle);
