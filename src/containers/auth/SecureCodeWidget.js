import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import _ from 'lodash';
import { Redirect } from 'react-router-dom';

import { RoutesService } from 'my-routes';
import { getSecure, checkSecure } from 'my-actions/systems/AuthAction';
import { CookieService } from 'my-utils/core';
import {TransComponent} from "../../components";

class SecureCodeWidget extends Component {
    constructor(props) {
        super(props);

        this.state = {
            value1: '',
            value2: '',
        };
        this.ref1 = React.createRef();
        this.ref2 = React.createRef();
    }

    componentDidMount() { this.props.getSecure(); }

    handleSubmit() { this.props.checkSecure(this.state); }

    handleChangeField = e => {
        const { value, name } = e.target;
        const isCharacter = isNaN(value);

        if (isCharacter || value.length > 1) {
            e.preventDefault();
        } else {
            this.setState({
                [name]: Number(value),
            }, () => {
                if (name === 'value1') {
                    this.ref2.current.focus();
                }
            });
        }
    };

    handleKeyDown = e => {
        if (e.key === 'Enter' && (this.state.value1 && this.state.value2)) return this.handleSubmit();
    };

    renderInput() {
        const t = this.props.t;
        const list = [
            t('first'),
            t('second'),
            t('third'),
            t('fourth'),
            t('fifth'),
            t('sixth')
        ];
        const [code1, code2] = [
            _.get(this.props, 'secureCode.code1', false),
            _.get(this.props, 'secureCode.code2', false),
        ];
        let renderData = <div />;

        if (code1 && code2) {
            renderData = list.map((item, index) => {
                const order = index + 1;

                if (order !== code1 && order !== code2) {
                    return (
                        <div key={index} className="form-group display-inline-block float-left margin-left-10 margin-right-10">
                            <input name="username" type="text" autoComplete="off"
                                className="width-40 height-40 border-none bg-red-sunglo" disabled
                            />
                        </div>
                    );
                }

                return (
                    <div key={index} className="form-group display-inline-block float-left margin-left-10 margin-right-10">
                        <input
                            name={order === code1 ? 'value1' : 'value2'}
                            autoFocus={order === code1 && !this.state.value1}
                            tabIndex={order === code1 ? 1 : 2}
                            type="text"
                            ref={order === code1 ? this.ref1 : this.ref2}
                            className="input-secure-code width-40 height-40 border-silver text-center"
                            autoComplete="off"
                            onChange={this.handleChangeField}
                            onKeyDown={e => this.handleKeyDown(e)}
                            value={order === code1 ? this.state.value1 : this.state.value2}
                        />
                    </div>
                );
            })
        }

        return renderData;
    }

    render() {

        if (this.props.checkSecureStatus === false) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />
        }

        if (this.props.checkSecureStatus) {
            if (CookieService.get('needChangeSecurePassword') === '1') {
                return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset-secure-password' })} />;
            }

            CookieService.set('byPassDashboard', '1');

            window.location.href = RoutesService.getPath('ADMIN', 'DASHBOARD');
        }

        return (
            <div className="login">
                <div className="content" style={{width: "420px"}}>
                    <div className="logo">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                    </div>
                        <h3 className="form-title font-red-sunglo"><TransComponent i18nKey="Please insert your security code" /></h3>
                        <div className="row text-center">
                            {this.renderInput()}
                        </div>
                        <div className="row form-actions text-center">
                            <button onClick={this.handleSubmit.bind(this)} disabled={!(this.state.value1 && this.state.value2)} type="submit" className="btn bg-red-sunglo font-white uppercase">
                                <TransComponent i18nKey="Continue" />
                            </button>
                        </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        secureCode: _.get(state, 'AuthReducer.secureCode', null),
        checkSecureStatus: state.AuthReducer.checkSecureStatus,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getSecure: () => { dispatch(getSecure()) },
        checkSecure: (secureCode) => { dispatch(checkSecure(secureCode)) },
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(SecureCodeWidget);