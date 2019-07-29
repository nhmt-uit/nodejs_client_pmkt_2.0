import React, {Component} from 'react';
import { Redirect } from 'react-router-dom';

import { AuthService } from 'my-services/systems'
import { RoutesService } from 'my-routes'

class LogoutContainer extends Component {
    componentDidMount() {
        AuthService.logout();
    }

    render() {
        return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />
    }
}

export default LogoutContainer;