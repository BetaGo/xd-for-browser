import {
  defaultTheme as spectrumDefaultTheme,
  Provider,
} from "@adobe/react-spectrum";
import { ThemeProvider } from "emotion-theming";
import React from "react";
import { HashRouter as Router, Route, Switch } from "react-router-dom";

import HomePage from "./pages/Home";
import StartPage from "./pages/Start";
import { defaultTheme } from "./styles/theme";

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
              <StartPage />
            </Route>
            <Route>
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </Provider>
    </ThemeProvider>
  );
}

export default App;
