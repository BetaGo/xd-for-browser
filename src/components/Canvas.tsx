import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

import { GRender } from "../draw/gRender";
import { Rectangle } from "../draw/shape";

const Root = styled.div`
  flex: 1;
`;

const Canvas = () => {
  const canvasContainerRef = useRef<HTMLDivElement>(null);
  const gRenderRef = useRef<GRender | null>(null);
  useEffect(() => {
    const gRender = new GRender(canvasContainerRef.current!);
    gRenderRef.current = gRender;
    const rect = new Rectangle(100, 100, 300, 200);
    rect.on("click", (e) => {
      console.log(e);
    });
    gRender.add(rect);
    gRender.render();
  }, []);

  return <Root ref={canvasContainerRef}></Root>;
};

export default Canvas;
