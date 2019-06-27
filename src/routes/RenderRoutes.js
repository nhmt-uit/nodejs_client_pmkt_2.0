import React from 'react';
import { Route, Switch } from "react-router-dom";

import { Routes } from 'my-routes';


const RenderRoutes = () => {
    let xhtml = null;
    if (Routes.length) {
        xhtml = Routes.map((route, index) => {
            return (
                <Route key={index} exact={route.exact} path={route.path} component={route.component} />
            )
        })
    }

    return <Switch>{xhtml}</Switch>
}

export default RenderRoutes;

