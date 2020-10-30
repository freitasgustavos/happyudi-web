import React from "react";
import { ToastContainer } from "react-toastify";
import { BrowserRouter, Switch, Route } from "react-router-dom";

import Landing from "./Pages/Landing";
import OrphanagerMap from "./Pages/OrphanagerMap";
import Orphanage from "./Pages/Orphanage";
import CreateOrphanage from "./Pages/CreateOrphanage";

function Routes() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={Landing} />
        <Route path="/app" component={OrphanagerMap} />

        <Route path="/create" component={CreateOrphanage} />
        <Route path="/:id" component={Orphanage} />
      </Switch>
      <ToastContainer autoClose={4000} />
    </BrowserRouter>
  );
}

export default Routes;
