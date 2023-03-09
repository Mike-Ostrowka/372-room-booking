import React from "react";
import ReactDOM from "react-dom";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthSignUpLayout from "./layouts/auth/AuthSignUp";
import AuthSignInLayout from "./layouts/auth/AuthSignIn";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import { ChakraProvider } from "@chakra-ui/react";
import { UserProvider } from "contexts/UserContext";
import theme from "./theme/theme";

ReactDOM.render(
  <ChakraProvider theme={theme}>
    <UserProvider>
      <React.StrictMode>
        <HashRouter>
          <Switch>
            <Route path={`/auth/sign-up`} component={AuthSignUpLayout} />
            <Route path={`/auth/sign-in`} component={AuthSignInLayout} />
            <Route path={`/admin`} component={AdminLayout} />
            <Route path={`/rtl`} component={RTLLayout} />
            {/* <Redirect from="/" to="/admin" /> */}
          </Switch>
        </HashRouter>
      </React.StrictMode>
    </UserProvider>
  </ChakraProvider>,
  document.getElementById("root")
);
