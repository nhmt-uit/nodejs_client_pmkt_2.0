import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {Field, reduxForm} from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import {get as _get, get, isEqual as _isEqual} from 'lodash';
import { Redirect } from 'react-router-dom';

import { RoutesService } from 'my-routes';
import { CookieService } from 'my-utils/core';
import { TransComponent } from 'my-components';
import { renderTextField } from 'my-utils/components/redux-form/render-ui-core';
import { AuthService } from 'my-services/systems';

class ResetSecurePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAccept: false,
            isLoading: false,
            success: false,
            error: false,
            msg: '',
        };
    }

    changeAcceptStatus(value) {
        this.setState({ isAccept: value });
    }

    renderAnnouncement() {
        return (
            <div className="div-top-center">
                <div className="content" style={{ padding: '1rem 2rem' }} >
                    <h3 className="text-center text-uppercase text-red">
                        <strong><TransComponent i18nKey="announcement" /></strong>
                    </h3>
                    <p><TransComponent i18nKey="Vietwin's accounting software has been updated secondary password function, please read carefully the content as below:" /></p>
                    <hr/>
                    <ul className="ul-announcement">
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;<TransComponent i18nKey='Creating secondary password: "New secondary password is not duplicated main password"' /></strong>
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;<TransComponent i18nKey="When creating secondary password for Vietwin's accounting software:" /></strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;<TransComponent i18nKey={`If log in to the software with secondary password, the interface only displays the homepage and the functions will be disabled. After logging into secondary password but still try to log in with the main password, the functions are still disabled. To reopen, please contact Customer Service Department for assistance.`} />
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-alert" />&nbsp;<TransComponent i18nKey="Recommendations: " /></strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;<TransComponent i18nKey="use only secondary password in an urgent case - eg: having security problems and required to log in, ..." />
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;<TransComponent i18nKey="the verification and reopening process will take a long time, so please don't try logging in for testing the function." />
                        </li>
                        <li className="text-primary">
                            <TransComponent i18nKey="Note: " />&nbsp;
                            <TransComponent i18nKey="From July 1, 2019, all accounts of accounting software are required to register by using the secondary password." />
                        </li>
                        <li>
                            <em><TransComponent i18nKey="If have any questions, please contact customer service department for answers." /></em>
                        </li>
                    </ul>
                    <p className='text-center'><button onClick={this.changeAcceptStatus.bind(this, true)} className="btn btn-primary red btn-announcement"><TransComponent i18nKey="i accept" /></button></p>
                </div>
            </div>
        );
    }

    handleSubmit = () => {
        this.setState({ isLoading: true }, async () => {
            const result = await AuthService.resetSecurePassword(this.props.formValues);

            if (result.status) {
                CookieService.set('byPassDashboard', '1');
                CookieService.set('needChangeSecurePassword', '0');
                this.setState({ isLoading: false, success: true })
            } else {
                this.setState({ isLoading: false, error: true, msg: _get(result, 'res.data.message', '') });

                setTimeout(() => this.setState({ error: false, msg: null }), 3000);
            }
        });
    };

    handleKeyDown = e => {
        if (e.key === 'Enter' && e.shiftKey === false && this.props.valid) return this.handleSubmit(e);
    };

    render() {
        const { valid, handleSubmit } = this.props;

        if (!Number(CookieService.get('isLogin')))
            return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />;

        if (this.state.success) {
            window.location.href = RoutesService.getPath('ADMIN', 'DASHBOARD');
        }

        if (!this.state.isAccept) return this.renderAnnouncement();

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <a href="index.html">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                        </a>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit(this.handleSubmit)} onKeyDown={e => this.handleKeyDown(e)} >
                        <h3 className="form-title font-red"><TransComponent i18nKey="Update secure password" /></h3>
                        { this.state.error
                            ? (
                                <div className="alert alert-danger">{ this.state.msg }</div>
                            )
                            : null
                        }
                        <div className="form-group">
                            <Field
                                name="new_password2"
                                type="password"
                                component={renderTextField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("insert new secure password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field
                                name="re_password2"
                                type="password"
                                component={renderTextField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={this.props.t("confirm new secure password")}
                            />
                        </div>
                        <div className="text-center">
                            <button type="submit" disabled={this.state.isLoading || !valid }  className="btn red uppercase">
                                <TransComponent i18nKey="Continue" />&nbsp;
                                { this.state.isLoading ? <i className={"fa fa-spin fa-spinner"} /> : null }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const validate = (values) => {
    const errors = {};

    if (!values.new_password2) errors.new_password2 = `"Secure Password" is not allowed to be empty`;
    else if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_password2)) {
        errors.new_password2 = `"Secure Password"  is required at least 8 characters, included Uppercase, normal and special`;
    }

    if (values.re_password2 && values.new_password2 && !_isEqual(values.new_password2, values.re_password2)) {
        errors.re_password2 = `"Confirm secure password" must be one of [ref:new_password2]`;
    }

    return errors;
};

const mapStateToProps = state => {
    return {
        formValues: get(state, 'form.form_secure_password.values', {}),
    };
};

export default compose(
    reduxForm({form: 'form_secure_password', validate}),
    connect(mapStateToProps, null),
    withTranslation()
)(ResetSecurePassword);