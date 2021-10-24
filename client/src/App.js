import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

import login from "./pages/login";
import register from "./pages/register";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Route path="/register" component={register} />
        <Route path="/login" component={login} />
        <Route path="/Dashboard" component={Dashboard} />
      </BrowserRouter>
    </div>
  );
};

export default App;
