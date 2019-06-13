import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import {Field, reduxForm} from "redux-form";
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

class ResetSecurePassword extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isAccept: false,
        };
    }

    changeAcceptStatus(value) {
        this.setState({
            isAccept: value,
        });
    }

    renderAnnouncement() {
        const t = this.props.t;

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

    handleSubmit() {

    }

    render() {
        const t = this.props.t;

        if (!this.state.isAccept) {
            this.renderAnnouncement.bind(this);
        }

        return (
            <div className="login" style={{ backgroundColor : 'transparent' }}>
                <div className="content">
                    <div className="logo">
                        <a href="index.html">
                            <img src="/assets/images/logo.png" alt="logo vw3" />
                        </a>
                    </div>
                    <form className="login-form" onSubmit={this.handleSubmit}>
                        <h3 className="form-title font-red">{t("Update secure password")}</h3>
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
                                placeholder={t("Insert new secure password")}
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
                                placeholder={t("Confirm new secure password")}
                            />
                        </div>
                        <div className="form-actions text-center">
                            <button type="submit" className="btn red uppercase">{t("Continue")}</button>
                            &nbsp;&nbsp;&nbsp;
                            <Link to="/dashboard" className="btn red uppercase">{t("Skip")}</Link>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initValueForm: get(state, 'form.form_secure_password.values', {}),
        auth: state.AuthReducer,
    };
};

const mapDispatchToProps = () => {

};

export default compose(
    reduxForm({form: 'form_secure_password'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ResetSecurePassword);