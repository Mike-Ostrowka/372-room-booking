import React, { useContext } from "react";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthSignUpLayout from "./layouts/auth/AuthSignUp";
import AuthSignInLayout from "./layouts/auth/AuthSignIn";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import { UserContext } from "./contexts/UserContext";

function App() {
  const { isLoggedIn } = useContext(UserContext);

  return (
    <React.StrictMode>
      <HashRouter>
        <Switch>
          <Route path={`/auth/sign-up`} component={AuthSignUpLayout} />
          <Route path={`/auth/sign-in`} component={AuthSignInLayout} />
          <Route path={`/admin`} component={AdminLayout} />
          <Route path={`/rtl`} component={RTLLayout} />
          {isLoggedIn ? (
            <Redirect from="/" to="/admin" />
          ) : (
            <Redirect from="/" to="/auth/sign-in" />
          )}
        </Switch>
      </HashRouter>
    </React.StrictMode>
  );
}

export default App;
