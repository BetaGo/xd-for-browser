import styled from "@emotion/styled";
import React, { useEffect, useRef } from "react";

import { GRender } from "../draw/gRender";
import { Rectangle } from "../draw/shape";
import { FillStyle, LinearGradient, StrokeStyle } from "../draw/style";

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

    const fillStyle = new FillStyle();
    fillStyle.setColor("#258");
    fillStyle.type = "gradient";
    const lg = new LinearGradient(200, 100, 200, 300);
    lg.addColorStop(0, "#fff");
    lg.addColorStop(1, "#000");
    fillStyle.gradient = lg;

    const strokeStyle = new StrokeStyle();
    strokeStyle.type = "solid";
    strokeStyle.width = 2;
    strokeStyle.setColor("#36d");
    rect.style = {
      stroke: strokeStyle,
      fill: fillStyle,
    };

    rect.on("click", (e) => {
      console.log(e);
    });
    gRender.add(rect);
    gRender.render();
  }, []);

  return <Root ref={canvasContainerRef}></Root>;
};

export default Canvas;
