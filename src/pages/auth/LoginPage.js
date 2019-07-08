import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';

import { FormLoginContainer } from 'my-containers/auth';

class LoginPage extends Component {
    render() {
        if (CookieService.get('byPassDashboard')) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'DASHBOARD')} />
        }
        return (
            <FormLoginContainer />
        );
    }
}

export default LoginPage;