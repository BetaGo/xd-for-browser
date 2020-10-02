import { defaultTheme, Divider, Provider } from "@adobe/react-spectrum";
import styled from "@emotion/styled";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Canvas from "./components/Canvas";
import Header from "./components/Header";
import PropertyEditor from "./components/PropertyEditor";
import ToolBox from "./components/ToolBox";
import Home from "./pages/Home";

const GridRoot = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: grid;
  grid-template-columns: 50px auto 292px;
  grid-template-rows: 42px auto;
`;

const HeaderGridItem = styled.div`
  grid-column: 1 / 4;
  grid-row: 1;
`;

const ToolBoxGridItem = styled.div`
  display: flex;
  grid-column: 1 / 2;
  grid-row: 2 / 3;
`;

const CanvasGridItem = styled.div`
  display: flex;
  grid-column: 2 / 3;
  grid-row: 2 / 3;
`;

const PropertyEditorGridItem = styled.div`
  display: flex;
  grid-column: 3 / 4;
  grid-row: 2 / 3;
`;

function App() {
  return (
    <Provider theme={defaultTheme} width="100%" height="100%" locale="en-US">
      <Router>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route>
            <GridRoot>
              <HeaderGridItem>
                <Header />
                <Divider size="M" />
              </HeaderGridItem>
              <ToolBoxGridItem>
                <ToolBox />
                <Divider orientation="vertical" size="M" />
              </ToolBoxGridItem>
              <CanvasGridItem>
                <Canvas />
              </CanvasGridItem>
              <PropertyEditorGridItem>
                <Divider orientation="vertical" size="M" />
                <PropertyEditor />
              </PropertyEditorGridItem>
            </GridRoot>
          </Route>
        </Switch>
      </Router>
    </Provider>
  );
}

export default App;
