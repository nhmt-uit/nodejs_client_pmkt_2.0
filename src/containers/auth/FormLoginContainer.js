import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form';
import { CookieService } from 'my-utils/core';
import $ from "jquery";
import {get as _get} from 'lodash';

import { changeLanguage } from 'my-actions/systems/LanguageAction';
import { login } from 'my-actions/systems/AuthAction';
import { RoutesService } from 'my-routes';
import { AppConfig } from "my-constants"
import { TransComponent } from 'my-components'

class FormLoginContainer extends React.Component {
    constructor(props) {
        super(props);
        this.props.initialize({ ...(this.props.initialValues || {}), lang_code: AppConfig.DEFAULT_LANG });
    }

    handleChangeLanguage = (e, newValue) => {
        this.props.changeLanguage(newValue)
    };

    handleSubmit = e => {
        this.props.login(this.props.initialValues);
        e.preventDefault();
    };

    handleKeyDown = e => {
        if (e.key === 'Enter' && e.shiftKey === false) {
            return this.handleSubmit(e);
        }
    };

    render() {
        var password = _get(this.props.initialValues, 'password');
        var username = _get(this.props.initialValues, 'username');
        var onSubmit = false;

        if(password && username){
            onSubmit = true
        }

        const { auth } = this.props;
        if (Number(CookieService.get('isLogin')) && auth.login_status) {
            $('div.alert').fadeIn();

            const redirect = CookieService.get('isReset') === '0'
                ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset' })
                : CookieService.get('isCheckSecure') === '0'
                    ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'secure' })
                    : CookieService.get('needChangeSecurePassword') === '1'
                        ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset-secure-password' })
                        : RoutesService.getPath('ADMIN', 'DASHBOARD');

            if (redirect.indexOf('dashboard') !== -1) {
                CookieService.set('byPassDashboard', '1');
                window.location.href = redirect;

                return null;
            }

            return  <Redirect to={redirect} />
        } else if (auth.login_status === false && _get(this.props, 'auth.errors.error_description', null)) {
            $('div.alert').fadeIn();
        }

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <img src="/assets/images/logo.png" alt="logo vw3" />
                    </div>
                    <form className="login-form" onSubmit={this.handleSubmit} onKeyDown={e => this.handleKeyDown(e)}>
                        <h3 className="form-title font-red">Login to VW3 Application</h3>
                        <div className="alert alert-danger display-hide">
                            <button className="close" data-close="alert" />
                            <span> <TransComponent i18nKey={this.props.auth.errors.error_description} /> </span>
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Username" /></label>
                            <Field
                                name="username"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("Username")}
                            />
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Password" /></label>
                            <Field
                                name="password"
                                type="password"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("Password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field name="lang_code" component="select" className="form-control" onChange={this.handleChangeLanguage}>
                                <option value="en">English</option>
                                <option value="vi">Tiếng Việt</option>
                            </Field>
                        </div>
                        <div className="form-actions text-center">
                            <button
                                type="submit"
                                className="btn red uppercase"
                                disabled={!onSubmit || _get(this.props, 'auth.isFetching', false)}>
                                <TransComponent i18nKey="Login" />&nbsp;
                                { _get(this.props, 'auth.isFetching', false) ? <i className="fa fa-spinner fa-spin" /> : null }
                            </button>
                        </div>
                    </form>
                </div>
                <div className="copyright"> 2019 © VW3 Application </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_login.values', {}),
        auth : state.AuthReducer,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        changeLanguage: params => {dispatch(changeLanguage(params))},
        login: params => {dispatch(login(params))}
    }
};

export default compose(
    reduxForm({form: 'form_login'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(FormLoginContainer);
