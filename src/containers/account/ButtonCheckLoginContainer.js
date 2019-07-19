import React, { Component } from 'react'
import PropTypes from 'prop-types'

import { AccountService } from 'my-services/account';

export default class ButtonCheckLoginContainer extends Component {
    static propTypes = {
        id: PropTypes.string.isRequired,
        isCheck: PropTypes.bool,
    };

    static defaultProps = {
        isCheck: false,
    };

    state = {
        isChecking: false,
        status: null,
    };

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.isCheck && nextProps.isCheck !== this.props.isCheck) {
            this.handleCheckLogin(this.props.id)();
        }
    }

    handleCheckLogin = id => () => {
        if (this.state.isChecking) {
            return null;
        }

        this.setState({ isChecking: true }, ()=> {
            return AccountService.checkLogin(id)
                .then(res => {
                    if (res.status) this.setState({ isChecking: false, status: 'success' });
                    else this.setState({ isChecking: false, status: 'err' });
                })
                .catch(() => this.setState({ isChecking: false, status: 'err' }));
        });
    };

    render() {
        const { isChecking, status } = this.state;

        let classIcon = 'fa-recycle';

        if (isChecking) classIcon = 'fa-spinner fa-spin';
        else if (status) {
            classIcon = status === 'success' ? 'fa-check font-green' : 'fa-close font-red';
        }

        return <i className={ `fa ${classIcon} cursor-pointer` } onClick={this.handleCheckLogin(this.props.id)} />
    }
}
