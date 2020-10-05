import {
  defaultTheme as spectrumDefaultTheme,
  Divider,
  Provider,
} from "@adobe/react-spectrum";
import { ThemeProvider } from "emotion-theming";
import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Canvas from "./components/Canvas";
import Header from "./components/Header";
import PropertyEditor from "./components/PropertyEditor";
import ToolBox from "./components/ToolBox";
import Home from "./pages/Home";
import styled from "./styles/styled";
import { defaultTheme } from "./styles/theme";

const GridRoot = styled.div`
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: 50px auto 292px;
  grid-template-rows: 42px auto;
  /**
  * prevent-content-from-expanding-grid-items
  * @see https://stackoverflow.com/a/43312314/9642423
  **/
  min-height: 0;
  min-width: 0;
`;

const HeaderGridItem = styled.div`
  grid-column: 1 / 4;
  grid-row: 1;
`;

const ToolBoxGridItem = styled.div`
  display: flex;
  grid-column: 1 / 2;
  grid-row: 2 / 3;
  overflow: hidden;
`;

const CanvasGridItem = styled.div`
  display: flex;
  grid-column: 2 / 3;
  grid-row: 2 / 3;
  overflow: hidden;
`;

const PropertyEditorGridItem = styled.div`
  display: flex;
  grid-column: 3 / 4;
  grid-row: 2 / 3;
  overflow: hidden;
`;

function App() {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Provider
        theme={spectrumDefaultTheme}
        width="100%"
        height="100%"
        locale="en-US"
        colorScheme="light"
      >
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
    </ThemeProvider>
  );
}

export default App;
