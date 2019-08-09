import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next'
import { Redirect } from 'react-router-dom'
import { Field, reduxForm } from 'redux-form';
import { CookieService } from 'my-utils/core';
import { get as _get, isEqual as _isEqual } from 'lodash';

import { RoutesService } from 'my-routes';
import { TransComponent } from 'my-components'
import { renderTextField } from 'my-utils/components/redux-form/render-ui-core';
import { AuthService } from 'my-services/systems';

class FormLoginContainer extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            error: false,
            msg: '',
            success: false,
        };
    }

    handleSubmit = e => {
        this.setState({ isLoading: true }, async () => {
            const result = await AuthService.reset(this.props.values);

            if (result.status) {
                this.setState({ isLoading: false, success: true })
            } else {
                this.setState({ isLoading: false, error: true, msg: _get(result, 'res.data.message', '') });

                setTimeout(() => this.setState({ error: false, msg: null }), 3000);
            }
        });

        e.preventDefault();
    };

    handleKeyDown = e => {
        if (e.key === 'Enter' && e.shiftKey === false && this.props.valid) return this.handleSubmit(e);
    };

    render() {
        const { valid } = this.props;

        if (!Number(CookieService.get('isLogin')) || Number(CookieService.get('isReset'))) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />;
        }

        if (this.state.success) {
            const redirect = CookieService.get('needChangeSecurePassword') === '1'
                ? RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset-secure-password' })
                : RoutesService.getPath('ADMIN', 'DASHBOARD');

            return <Redirect to={redirect} />;
        }

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <img src="/assets/images/logo.png" alt="logo vw3" />
                    </div>
                    <form className="login-form" onSubmit={this.handleSubmit} onKeyDown={e => this.handleKeyDown(e)}>
                        <h3 className="form-title font-red"><TransComponent i18nKey="Update Account Infomation" /></h3>
                        { this.state.error ? (
                            <div className="alert alert-danger">
                                <button className="close" data-close="alert" />
                                <span> <TransComponent i18nKey={this.state.msg} /> </span>
                            </div>
                        ) : null }
                        <div className="form-group">
                            <Field
                                name="new_pass"
                                type="password"
                                component={renderTextField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("insert new password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field
                                name="new_conf_pass"
                                type="password"
                                component={renderTextField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("Confirm new password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field
                                name="secure_code"
                                type="text"
                                component={renderTextField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("Security code")}
                            />
                        </div>
                        <div className="form-actions text-center">
                            <button type="submit" className="btn red uppercase" disabled={!valid || this.state.isLoading} >
                                <TransComponent i18nKey="Continue" />&nbsp;
                                { this.state.isLoading ? <i className="fa fa-spin fa-spinner" /> : null }
                            </button>
                        </div>
                    </form>
                </div>
                <div className="copyright"> 2019 © VW3 Application </div>
            </div>
        );
    }
}

const validate = (values) => {
    const errors = {};

    if (!values.new_pass) errors.new_pass = `"Password" is not allowed to be empty`;
    else if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_pass)) {
        errors.new_pass = `"Password"  is required at least 8 characters, included Uppercase, normal and special`;
    }

    if (!values.secure_code) errors.secure_code = `"Secure code" is not allowed to be empty`;
    else if (isNaN(Number(values.secure_code)) || (values.secure_code.length > 6 || values.secure_code.length < 6)) {
        errors.secure_code = '"Secure code"  is required equal 6 numbers';
    }

    if (values.new_conf_pass && values.new_pass && !_isEqual(values.new_pass, values.new_conf_pass)) {
        errors.new_conf_pass = `"Confirm password" must be one of [ref:new_pass]`;
    }

    return errors;
};

const mapStateToProps = state => {
    return {
        values: _get(state, 'form.form_reset.values', {}),
    }
};

export default compose(
    reduxForm({form: 'form_reset', validate}),
    connect(mapStateToProps, null),
    withTranslation(),
)(FormLoginContainer);
