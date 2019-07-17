import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next'
import { Field, reduxForm } from 'redux-form';
import {get as _get, isEmpty as _isEmpty} from 'lodash';

import { socketAccountantManualInitData, socketAccountantManualResetData, socketAccountantManualGetFromData, socketAccountantManualSubmitFromData} from 'my-actions/AccountantManualAction';
import {TransComponent} from 'my-components'
import { RoutesService } from 'my-routes';

class BankerLoginContainer extends Component {
  
    componentDidMount() {
        const bankerName = this.props.match.params.bankerName
        this.props.socketAccountantManualInitData({bankerName})
    }

    componentWillUnmount() {
        this.props.socketAccountantManualResetData()
    }

    /*
    |--------------------------------------------------------------------------
    | Send Socket to get form data
    |--------------------------------------------------------------------------
    */
    handleInitFormBankerLogin = _ => {
        this.props.socketAccountantManualGetFromData({bankerId: this.props.banker.bankerSocketRequestId})
    }

    /*
    |--------------------------------------------------------------------------
    | Handle submit form banker login
    |--------------------------------------------------------------------------
    */
    handleSubmit = e => {
        const params = {
            ...this.props.initialValues,
            bankerId: this.props.banker.bankerSocketRequestId,
            post: this.props.payload.post,
            session: this.props.payload.session
        }
        this.props.socketAccountantManualSubmitFromData(params)
        e.preventDefault();
    }

    handleKeyDown = e => {
        if (e.key === 'Enter' && e.shiftKey === false) {
            return this.handleSubmit(e);
        }
    }

    render() {
        const { isRenderFinish, payload, payload_reject, banker } = this.props
        const bankerName = this.props.match.params.bankerName
        const errorSubmit = _get(payload, 'err')
        const isLoginSuccess = _get(payload, 'loginSuccess', false)
        const needCaptcha = _get(payload, 'captcha', false)
        const needSecurity = _get(banker, 'need_security', false)

        var captcha = _get(this.props.initialValues, 'captcha');
        var subCode = _get(this.props.initialValues, 'sub_code');
        var subPass = _get(this.props.initialValues, 'sub_pass');
        var subUser = _get(this.props.initialValues, 'sub_user');

        var onSubmit = true;
        if(!subUser || !subPass) onSubmit = false
        if(needCaptcha){
            if(!captcha) onSubmit = false
        }
        if(needSecurity){
            if(!subCode) onSubmit = false
        }

        if(isLoginSuccess) {
            this.props.history.push(RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { bankerName: bankerName, type: '' }))
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo"><span className="caption-subject bold uppercase"><TransComponent i18nKey="Accountant Manual" /></span></div>
                </div>
                <div className="portlet-body form">
                    <form className="form-banker-login login-form" onSubmit={this.handleSubmit} onKeyDown={e => this.handleKeyDown(e)}>
                        <h3 className="form-title font-red text-center uppercase">
                            <TransComponent i18nKey="Login to" /> {bankerName}
                            {!isRenderFinish ? <i className="fa fa-spinner spinner-animate" style={{marginLeft: '5px'}} /> : null }
                        </h3>
                        { !_isEmpty(banker) ?
                            <div className="logo text-center">
                                <img src={`/assets/images/logo/logo-${banker.short_name.toLowerCase()}.png`} alt={bankerName} />
                            </div>
                            : null
                        }
                        { !_isEmpty(errorSubmit) || !_isEmpty(payload_reject) ?
                            <div className="alert alert-danger">
                                <span> <TransComponent i18nKey={_get(errorSubmit, 'message', _get(payload_reject, 'message'))} /> </span>
                            </div>
                            : null
                        }
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Username" /></label>
                            <div className="input-icon right">
                                <i className="fa fa-user"></i>
                                <Field
                                    name="sub_user"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                    placeholder={this.props.t("Username")}
                                />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Password" /></label>
                            <div className="input-icon right">
                                <i className="fa fa-lock"></i>
                                <Field
                                    name="sub_pass"
                                    type="password"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                    placeholder={this.props.t("Password")}
                                />
                            </div>
                        </div>

                        {/* Security Code  */}
                        { !_isEmpty(banker) && banker.need_security ?
                            <div className="form-group">
                                <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Password" /></label>
                                <div className="input-icon right">
                                    <i className="fa fa-shield"></i>
                                    <Field
                                        name="sub_code"
                                        type="password"
                                        component="input"
                                        className="form-control form-control-solid placeholder-no-fix"
                                        autoComplete="off"
                                        placeholder={this.props.t("Security code")}
                                    />
                                </div>
                            </div>
                            : null
                        }

                        {/* Captcha */}
                        { _get(payload, 'captcha', false)?
                            <div className="row">
                                <div className="form-group col-md-6">
                                    <label className="control-label visible-ie8 visible-ie9"><TransComponent i18nKey="Captcha" /></label>
                                    <div className="input-icon right input-medium">
                                        <i className="fa fa-qrcode"></i>
                                        <Field
                                            name="captcha"
                                            type="text"
                                            component="input"
                                            className="form-control form-control-solid placeholder-no-fix"
                                            autoComplete="off"
                                            placeholder={this.props.t("Captcha")}
                                        />
                                    </div>
                                </div>
                                <div className="form-group col-md-6">
                                    <div className="captcha text-right">
                                        <img src={`data:image/png;base64,${_get(payload, 'captcha')}`} alt={bankerName} height="34px" onClick={this.handleInitFormBankerLogin} />
                                    </div>
                                </div>
                            </div>
                            :null
                        }
                        <div className="form-actions text-center input-group-btn">
                            <button type="submit" className="btn red uppercase" disabled={!isRenderFinish || !_isEmpty(payload_reject) || !onSubmit}>
                                { isRenderFinish ? <TransComponent i18nKey="Login" /> : <TransComponent i18nKey="Please wait" /> }
                                { !isRenderFinish ? <i className="fa fa-spinner spinner-animate" style={{marginLeft: '5px'}} /> : null }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_accountant_manual_login.values', {}),
        isRenderFinish : state.AccountantManualReducer.isRenderFinish,
        payload : state.AccountantManualReducer.payload,
        payload_reject : state.AccountantManualReducer.payload_reject,
        banker : state.AccountantManualReducer.banker,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        socketAccountantManualInitData: params => {dispatch(socketAccountantManualInitData(params))},
        socketAccountantManualResetData: _ => {dispatch(socketAccountantManualResetData())},
        socketAccountantManualGetFromData: params => {dispatch(socketAccountantManualGetFromData(params))},
        socketAccountantManualSubmitFromData: params => {dispatch(socketAccountantManualSubmitFromData(params))},
    }
};

export default compose(
    reduxForm({form: 'form_accountant_manual_login'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
    withRouter
)(BankerLoginContainer);

