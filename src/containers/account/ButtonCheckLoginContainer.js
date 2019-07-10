import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AccountService } from 'my-services/account';

export default class ButtonCheckLoginContainer extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired
    }

    state = {
        isChecking: false,
        isSuccess: false,
    };

    handleCheckLogin = id => () => {
        this.setState({ 
            isChecking: true
        }, ()=> {
            let isChecking = true;
            let isSuccess = false;

            AccountService.checkLogin(id)
                .then(res => {
                    if (res.status) {
                        isChecking = false;
                        isSuccess = true;
                    } else {
                        isChecking = false;
                        isSuccess = false;
                    }
                })
                .catch(e => {
                    isChecking = false;
                    isSuccess = false;
                });

            this.setState({
                isChecking,
                isSuccess
            });
        });
    }

    render() {
        return <i className="fa fa-recycle" onClick={this.handleCheckLogin(this.props.id)} />
    }
}
