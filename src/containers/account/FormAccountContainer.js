import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import Select from 'react-select';
import { Field, reduxForm } from 'redux-form';
import { get as _get, isEmpty as _isEmpty } from 'lodash'

import { requestInitFormData } from 'my-actions/AccountAction'


const formatGroupLabel = data => (
    <div style={{fontWeight: 'bold', fontSize: '14px', color: '#333'}}>
        <span>{data.label}</span>
    </div>
  );
const optAccountStatus = [{value: false, label: "False"}, {value: true, label: "True"}]
const optIsSub = [{value: 0, label: "Sub"}, {value: 1, label: "Admin"}, {value: 2, label: "Agent"}, {value: 3, label: "Master"},  {value: 4, label: "Super"}]

const bankerIsSub = ['s1288','hk1119']

class FormAccountContainer extends Component {
    componentWillMount() {
        console.log(this.props.account)
        this.props.requestInitFormData(this.props.account.id)
        this.props.initialize({...this.props.initialValues,
            id: this.props.account.id,
            company: this.props.account.banker,
            acc_name: this.props.account.acc_name,
            belong_account: this.props.account.acc_parent_id,
            sub_user: this.props.account.sub_user,
            sub_pass: this.props.account.sub_pass,
            sub_code: this.props.account.sub_code,
            note: this.props.account.note,
            is_banker_sub: 0,
            is_active: this.props.account.is_active,
        })
    }

    handleChangeBanker = item => {
        this.props.initialize({...this.props.initialValues, company: item.value })
    }

    handleChangeBelongAcc = item => {
        this.props.initialize({...this.props.initialValues, belong_account: item.value })
    }
    
    handleChangeIsSub = item => {
        this.props.initialize({...this.props.initialValues, is_banker_sub: item.value })
    }

    render() {
        const { t } = this.props
        const optBanker = this.props.optBanker
        const optAccountBelong = [{value: "root", label: t("Is root account").toUpperCase()}].concat(this.props.optAccountBelong.filter(item => item.value === this.props.initialValues.company))

        const selectedBanker = optBanker.filter(item => item.value === this.props.initialValues.company)
        const belong_account = this.props.initialValues.belong_account ? this.props.initialValues.belong_account : "root"
        const selectedAccountBelong = !_isEmpty(optAccountBelong[1]) && belong_account !== "root" ? optAccountBelong[1].options.filter(item => item.value === belong_account) : optAccountBelong.filter(item => item.value === belong_account)
        const selectedAccountStatus = optAccountStatus.filter(item => item.value === this.props.initialValues.is_active)
        const selectedIsSub = optIsSub.filter(item => item.value === this.props.initialValues.is_banker_sub)

        const isDisabledBasedOneAccountBelong = belong_account === "root" ? false : true

        return (
            <form>
                <div className="form-body">
                    <div className="form-group">
                        <label>{t("Company")}</label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="banker_name"
                            isDisabled={isDisabledBasedOneAccountBelong}
                            value={selectedBanker}
                            isSearchable={true}
                            placeholder={t('choose')}
                            onChange={this.handleChangeBanker}
                            options={optBanker}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("Account name")}</label>
                        <Field
                            name="acc_name"
                            type="text"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                            readOnly={!isDisabledBasedOneAccountBelong}
                        />
                    </div>
                    <div className="form-group">
                        <label>{t("Belong to account")}</label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="belong_account"
                            value={selectedAccountBelong}
                            isSearchable={true}
                            placeholder={t('choose')}
                            onChange={this.handleChangeBelongAcc}
                            options={optAccountBelong}
                            formatGroupLabel={formatGroupLabel}
                            menuPosition="fixed"
                        />
                    </div>
                    { belong_account === "root" ? (
                        <>
                            <div className="form-group">
                                <label>{t("Login User")}</label>
                                <Field
                                    name="sub_user"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="form-group">
                                <label>{t("Sub password")}</label>
                                <Field
                                    name="sub_pass"
                                    type="password"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            {
                            _get(selectedBanker[0], 'need_security', false) ? (
                                <div className="form-group">
                                    <label>{t("Secure code")}</label>
                                    <Field
                                        name="sub_code"
                                        type="text"
                                        component="input"
                                        className="form-control form-control-solid placeholder-no-fix"
                                        autoComplete="off"
                                    />
                                </div>
                            ) : null
                            }
                            <div className="form-group">
                                <label>{t("Note")}</label>
                                <Field
                                    name="note"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            { _isEmpty(selectedBanker.filter(item => bankerIsSub.indexOf(item.label.toLowerCase()) === -1)) ? (
                                <>
                                    <div className="form-group">
                                        <label>{t("The number of log")}</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="is_banker_sub"
                                            value={selectedIsSub}
                                            isSearchable={true}
                                            placeholder={t('choose')}
                                            onChange={this.handleChangeIsSub}
                                            options={optIsSub}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t("Permission")}</label>
                                        <Select
                                            className="basic-single"
                                            classNamePrefix="select"
                                            name="is_banker_sub"
                                            value={selectedIsSub}
                                            isSearchable={true}
                                            placeholder={t('choose')}
                                            onChange={this.handleChangeIsSub}
                                            options={optIsSub}
                                            menuPosition="fixed"
                                        />
                                    </div>
                                </>
                            ) : null }
                        </>
                    ) : null }
                    <div className="form-group">
                        <label>{t("Is Active")}</label>
                        <Select
                            className="basic-single"
                            classNamePrefix="select"
                            name="is_active"
                            value={selectedAccountStatus}
                            isDisabled={true}
                            isSearchable={false}
                            onChange={this.handleChangeCycleClose}
                            options={optAccountStatus}
                        />
                    </div>
                </div>
            </form>
        )
    }
}


const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_account.values', {}),
        initFormData : state.AccountReducer.initFormData,
        optBanker : state.AccountReducer.optBanker,
        optAccountBelong : state.AccountReducer.optAccountBelong,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestInitFormData: (accountId) => {dispatch(requestInitFormData(accountId))},
    }
};

export default compose(
    reduxForm({form: 'form_account'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(FormAccountContainer);