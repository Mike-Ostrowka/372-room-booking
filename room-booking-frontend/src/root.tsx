import React, { useContext } from "react";
import "./assets/css/App.css";
import { HashRouter, Route, Switch, Redirect } from "react-router-dom";
import AuthSignUpLayout from "./layouts/auth/AuthSignUp";
import AuthSignInLayout from "./layouts/auth/AuthSignIn";
import AdminLayout from "./layouts/admin";
import RTLLayout from "./layouts/rtl";
import { UserContext } from "./contexts/UserContext";

function App() {
  const { loggedInUser } = useContext(UserContext);

  return (
    <React.StrictMode>
      <HashRouter>
        <Switch>
          {loggedInUser !== null ? (
            <>
              <Route path={`/admin`} component={AdminLayout} />
              <Route path={`/rtl`} component={RTLLayout} />
              <Redirect to="/admin" />
            </>
          ) : (
            <>
              <Route path={`/auth/sign-up`} component={AuthSignUpLayout} />
              <Route path={`/auth/sign-in`} component={AuthSignInLayout} />
              <Redirect to="/auth/sign-in" />
            </>
          )}
        </Switch>
      </HashRouter>
    </React.StrictMode>
  );
}

export default App;
