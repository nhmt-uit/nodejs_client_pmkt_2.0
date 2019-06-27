import React, { Component } from 'react';

import { SecureCodeWidget } from 'my-containers/auth';

class LoginPage extends Component {
    render() {
        return (
            <SecureCodeWidget />
        );
    }
}

export default LoginPage;