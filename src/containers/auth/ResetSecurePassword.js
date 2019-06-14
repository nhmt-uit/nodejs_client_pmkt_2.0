import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {Field, reduxForm, SubmissionError} from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Redirect } from 'react-router-dom';
import $ from 'jquery';

import { resetSecurePassword } from 'my-actions/systems/AuthAction';
import { RoutesService } from 'my-routes';
import { CookieService } from 'my-utils/core';

class ResetSecurePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAccept: false,
        };
    }

    UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.error) {
            this.setState({
                error: nextProps.error,
            });
        }
    }

    changeAcceptStatus(value) {
        this.setState({
            isAccept: value,
        });
    }

    renderAnnouncement(t) {
        return (
            <div className="div-top-center">
                <div className="content" style={{ padding: '1rem 2rem' }} >
                    <h3 className="text-center text-uppercase text-red">
                        <strong>{t('announcement')}</strong>
                    </h3>
                    <p>{t('Vietwin\'s accounting software has been updated secondary password function, please read carefully the content as below')}</p>
                    <hr/>
                    <ul className="ul-announcement">
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;{t('creating secondary password "new secondary password is not duplicated main password"')}</strong>
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-pushpin" />&nbsp;{t('when creating secondary password for vietwin\'s accounting software')}</strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t(`if log in to the software with secondary password, the interface only displays the homepage and the
                             functions will be disabled. after logging into secondary password but still try
                              to log in with the main password, the functions are still disabled. to reopen, please contact customer service department for assistance.`)}
                        </li>
                        <li className="text-red">
                            <strong><span className="glyphicon glyphicon-alert" />&nbsp;{t('recommendations')}</strong>
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t('use only secondary password in an urgent case - eg: having security problems and required to log in, ...')}
                        </li>
                        <li>
                            <span className="glyphicon glyphicon-circle-arrow-right" />&nbsp;{t('the verification and reopening process will take a long time, so please don\'t try logging in for testing the function.')}
                        </li>
                        <li className="text-primary">
                            {t('Note from july 1, 2019, all accounts of accounting software are required to register by using the secondary password.')}
                        </li>
                        <li>
                            <em>{t('If have any questions, please contact customer service department for answers.')}</em>
                        </li>
                    </ul>
                    <p className='text-center'><button onClick={this.changeAcceptStatus.bind(this, true)} className="btn btn-primary red btn-announcement">{t('i accept')}</button></p>
                </div>
            </div>
        );
    }

    validateForm(values) {
        if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_password2)) {
            throw new SubmissionError({
                new_password2: 'is required at least 8 characters, included Uppercase, normal and special',
                _error: 'Secure password is required at least 8 characters, included Uppercase, normal and special'
            });
        }
        
        if (values.new_password2.trim() !== get(values, 're_password2', '').trim()) {
            throw new SubmissionError({
                new_password2: 'Confirm secure password do not match secure password',
                _error: 'Confirm secure password do not match secure password'
            });
        }

        this.props.resetSecurePassword(this.props.formValues);
    }

    renderField({ input, label, type, meta: { touched, error }, ...otherProps }) {
        return (
            <div>
                <div>
                    <input className={otherProps.className} {...input} placeholder={otherProps.placeholder} type={type} />
                </div>
            </div>
        )
    }

    handleSkip() {
        CookieService.set('byPassDashboard', true);

        this.forceUpdate();
    }

    render() {
        const { t, handleSubmit, submitting, error, auth } = this.props;

        if (Number(CookieService.get('needChangeSecurePassword')) === 0 && this.state.isAccept) {
            this.handleSkip();
        }

        if (CookieService.get('byPassDashboard')) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'DASHBOARD')} />
        }

        if (!this.state.isAccept) {
            return this.renderAnnouncement(t);
        }

        if (error || get(auth, 'errors.error_description', null)) {
            $('div.alert').fadeIn()
        } else {
            $('div.alert').fadeOut()
        }

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <a href="index.html">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                        </a>
                    </div>
                    <form className="login-form" onSubmit={handleSubmit(this.validateForm.bind(this))}>
                        <h3 className="form-title font-red">{t("Update secure password")}</h3>
                        <div className="alert alert-danger display-hide">
                            {
                                get(this.props.auth, 'errors.error_description', null)
                                    ? <span> {t(this.props.auth.errors.error_description)} </span>
                                    : this.props.error && <span>{t(this.props.error)}</span>
                            }
                        </div>
                        <div className="form-group">
                            <Field
                                name="new_password2"
                                type="password"
                                component={this.renderField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={t("Insert new secure password")}
                            />
                        </div>
                        <div className="form-group">
                            <Field
                                name="re_password2"
                                type="password"
                                component={this.renderField}
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                placeholder={t("Confirm new secure password")}
                            />
                        </div>
                        <div className="form-actions text-center">
                            <button type="submit" disabled={submitting} className="btn red uppercase">{t("Continue")}</button>
                            &nbsp;&nbsp;&nbsp;
                            <button disabled={submitting} onClick={this.handleSkip.bind(this)} className="btn red uppercase">{t("Skip")}</button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        formValues: get(state, 'form.form_secure_password.values', {}),
        auth: state.AuthReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        resetSecurePassword: params => { dispatch(resetSecurePassword(params)) }
    };
};

export default compose(
    reduxForm({form: 'form_secure_password'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ResetSecurePassword);