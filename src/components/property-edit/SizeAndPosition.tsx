import React, { useEffect, useState } from "react";
import styled from "../../styles/styled";
import { TextField } from "@adobe/react-spectrum";
import { observer } from "mobx-react";
import { useStores } from "../../hooks/useStores";
import { IBoundingRect } from "../../draw/shape";
import { IElementEvent } from "../../draw/events";

const Root = styled.div``;

const SizeAndPosition = () => {
  const { canvasStore } = useStores();
  const selectedElement = canvasStore.selectedElement;
  const [boundingRect, setBoundingRect] = useState<IBoundingRect | undefined>(
    selectedElement?.getBoundingBox().getTransformed()
  );

  useEffect(() => {
    const handleBoundingChange = (e: IElementEvent) => {
      setBoundingRect(e.target.getBoundingBox().getTransformed());
    };
    if (selectedElement) {
      selectedElement.on("boundingChange", handleBoundingChange);
    }
    return () => {
      selectedElement?.off("boundingChange", handleBoundingChange);
    };
  }, [selectedElement]);

  return (
    <Root>
      <TextField label="W" isQuiet value={boundingRect?.width.toString()} />
      <TextField label="H" isQuiet value={boundingRect?.height.toString()} />
      <TextField label="X" isQuiet value={boundingRect?.x.toString()} />
      <TextField label="Y" isQuiet value={boundingRect?.y.toString()} />
      <TextField label="R" isQuiet value={boundingRect?.rotate.toString()} />
    </Root>
  );
};

export default observer(SizeAndPosition);
