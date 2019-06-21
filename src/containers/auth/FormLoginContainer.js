import React from 'react';
import { withTranslation } from 'react-i18next';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form';
import { CookieService } from 'my-utils/core';
import $ from "jquery";
import _ from 'lodash';

import { changeLanguage } from 'my-actions/systems/LanguageAction';
import { login } from 'my-actions/systems/AuthAction';
import { RoutesService } from 'my-routes';
import { AppConfig } from "my-constants"

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

    handleKeyDown(e) {
        if (e.key === 'Enter' && e.shiftKey === false) {
            return this.handleSubmit(e);
        }
    }

    render() {
        const { t, auth } = this.props;
        if (auth.login_status) {
            $('div.alert').fadeIn();

            const redirect = CookieService.get('isCheckSecure')
                ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'secure' })
                : CookieService.get('needChangeSecurePassword')
                    ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset-secure-password' })
                    : RoutesService.getPath('ADMIN', 'DASHBOARD');
            return  <Redirect to={redirect} />
        } else if (auth.login_status === false && _.get(this.props, 'auth.errors.error_description', null)) {
            $('div.alert').fadeIn();
        }

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <a href="index.html">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                        </a>
                    </div>
                    <form className="login-form" onSubmit={this.handleSubmit} onKeyDown={this.handleKeyDown.bind(this)}>
                        <h3 className="form-title font-red">{t("Login to VW3 Application")}</h3>
                        <div className="alert alert-danger display-hide">
                            <button className="close" data-close="alert" />
                            <span> {t(this.props.auth.errors.error_description)} </span>
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9">{t("Username")}</label>
                            <Field
                                name="username"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={t("Username")}
                            />
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9">{t("Password")}</label>
                            <Field
                                name="password"
                                type="password"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={t("Password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field name="lang_code" component="select" className="form-control" onChange={this.handleChangeLanguage}>
                                <option value="en">English</option>
                                <option selected value="vi">Tiếng Việt</option>
                            </Field>
                        </div>
                        <div className="form-actions text-center">
                            <button type="submit" className="btn red uppercase">{t("Login")}</button>
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
        initialValues: _.get(state, 'form.form_login.values', {}),
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
    withTranslation()
)(FormLoginContainer);
