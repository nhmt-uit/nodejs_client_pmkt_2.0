import React, { Component } from 'react';
import { BrowserRouter as Router } from "react-router-dom";

import RenderRoutes from 'my-routes/RenderRoutes';
import 'my-public/assets/pages/css/login.min.css';


class AuthenticationLayout extends Component {
    
    render() {
        return (
            <Router>
                <RenderRoutes />
            </Router>
        )
    }
}

export default AuthenticationLayout;
