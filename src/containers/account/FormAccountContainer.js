import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import Select from 'react-select';
import { Field, reduxForm } from 'redux-form';
import { get as _get, isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'

import { requestInitFormData, saveAccount, resetFormSaveResponse } from 'my-actions/AccountAction'
import { TransComponent } from 'my-components'
import { renderSelectField, renderError, renderFormatGroupLabel } from 'my-utils/components/redux-form/render-form'
import { AccountService } from 'my-services/account'


const optAccountStatus = [{value: false, label: "False"}, {value: true, label: "True"}]
const optIsSub = [{value: 0, label: "Sub"}, {value: 1, label: "Admin"}, {value: 2, label: "Agent"}, {value: 3, label: "Master"},  {value: 4, label: "Super"}]

const bankerIsSub = ['s1288','hk1119']

class FormAccountContainer extends Component {
    componentWillMount() {
        this.props.requestInitFormData(_get(this.props, 'account.id'))
        // Init Default Value
        if(this.props.formType === "create") {
            this.props.initialize({...this.props.initialValues,
                is_active: optAccountStatus.find(item => item.value === true),
                belong_account: {value: "root", label: <TransComponent i18nKey="Is root account" toUpperCase />},
                is_sub: optIsSub.find(item => item.value === 0),
            })
        }
    }

    componentDidUpdate(prevProps){
        // Init Form Incase Edit Item
        if(!_isEqual(prevProps.optBanker, this.props.optBanker) ||!_isEqual(prevProps.optAccountBelong, this.props.optAccountBelong)) {
            if(this.props.formType === "update" && !_isEmpty(this.props.selectedItem)) {
                const optAccountBelong = [{value: "root", label: <TransComponent i18nKey="Is root account" toUpperCase />}].concat(this.props.optAccountBelong)
                const belong_account_item = this.props.selectedItem.acc_parent_id ? this.props.selectedItem.acc_parent_id : "root"
                this.props.initialize({...this.props.initialValues,
                    id: this.props.selectedItem.id,
                    company: this.props.optBanker.find(item => item.value === this.props.selectedItem.banker),
                    acc_name: this.props.selectedItem.acc_name,
                    belong_account:  optAccountBelong.find(item => item.value === belong_account_item),
                    sub_user: this.props.selectedItem.sub_user,
                    sub_pass: this.props.selectedItem.sub_pass,
                    sub_code: this.props.selectedItem.sub_code,
                    note: this.props.selectedItem.note,
                    is_sub: optIsSub.find(item => item.value === this.props.selectedItem.is_sub),
                    is_active: optAccountStatus.find(item => item.value === this.props.selectedItem.is_active),
                })
            }
        }
    }
    
    handleSubmit = e => {
        const payload = {
            acc_name: _get(this.props.initialValues, 'acc_name', ""),
            company: _get(this.props.initialValues, 'company.value', ""),
            banker_name: _get(this.props.initialValues, 'company.name', ""),
            book_name: _get(this.props.initialValues, 'company.book_name', ""),
            need_security: _get(this.props.initialValues, 'company.need_security', ""),
            sub_user: _get(this.props.initialValues, 'sub_user', ""),
            sub_pass: _get(this.props.initialValues, 'sub_pass', ""),
        }


        if (_get(this.props.initialValues, 'belong_account.value') !== 'root') payload.belong_account = _get(this.props.initialValues, 'belong_account.value', "")
        if (_get(this.props.initialValues, 'belong_account.value') === 'root') payload.check_login = 'yes'
        if (!_isEmpty(_get(this.props.initialValues, 'sub_code'))) payload.sub_code = _get(this.props.initialValues, 'sub_code')
        if (_get(this.props.initialValues, 'is_sub')) payload.is_sub = _get(this.props.initialValues, 'is_sub.value', 0)
        if (!_isEmpty(_get(this.props.initialValues, 'note'))) payload.note = _get(this.props.initialValues, 'note')

        // Incase Edit Item
        if(this.props.formType === "update") {
            payload.id = _get(this.props.initialValues, 'id')
        }


        this.props.saveAccount(payload)
    }

    renderAlert = _ => {
        const { formSaveStatus, formSaveResponse } = this.props
        if(formSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formSaveResponse.data.message} </b></span>
                </div>
            )
        } else if(formSaveStatus === true) {
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formSaveResponse.data.message} </b></span>
                </div>
            )
        }
        return null
    }


    render() {
        
        console.log(this.props.initialValues)
        
        const {optBanker, formType} = this.props
        const company = _get(this.props.initialValues, 'company')
        const optAccountBelong = [{value: "root", label: <TransComponent i18nKey="Is root account" toUpperCase />}].concat(this.props.optAccountBelong.filter(item => item.value === _get(company, 'value')))

        const belong_account = _get(this.props.initialValues, 'belong_account')
        const isDisabledBasedOneAccountBelong = _get(belong_account, 'value') === "root" ? false : true

        return (
            <form name="form_account">
                <div className="form-body">
                    {this.renderAlert()}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Company" /></label>
                        <Field
                            name="company"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={optBanker}
                            isDisabled={isDisabledBasedOneAccountBelong}
                            />
                        <Field name="company"component={renderError} />
                    </div>
                    {
                        formType === "update" || _get(belong_account, 'value') !== "root" ?
                            <div className="form-group">
                                <label><TransComponent i18nKey="Account name" /></label>
                                <Field
                                    name="acc_name"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                    readOnly={!isDisabledBasedOneAccountBelong}
                                />
                                <Field name="acc_name"component={renderError} />
                            </div>
                        : null
                    }
                    <div className="form-group">
                        <label><TransComponent i18nKey="Belong to account" /></label>
                        <Field
                            name="belong_account"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={optAccountBelong}
                            formatGroupLabel={renderFormatGroupLabel}
                            menuPosition="fixed"
                            />
                    </div>
                    { _get(belong_account, 'value') === "root" ? (
                        <>
                            <div className="form-group">
                                <label><TransComponent i18nKey="Login User" /></label>
                                <Field
                                    name="sub_user"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            <div className="form-group">
                                <label><TransComponent i18nKey="Sub password" /></label>
                                <Field
                                    name="sub_pass"
                                    type="password"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            {
                                _get(company, 'need_security', false) ? (
                                <div className="form-group">
                                    <label><TransComponent i18nKey="Secure code" /></label>
                                    <Field
                                        name="sub_code"
                                        type="text"
                                        component="input"
                                        className="form-control form-control-solid placeholder-no-fix"
                                        autoComplete="off"
                                    />
                                    <Field name="sub_code"component={renderError} />
                                </div>
                                ) : null
                            }
                            <div className="form-group">
                                <label><TransComponent i18nKey="Note" /></label>
                                <Field
                                    name="note"
                                    type="text"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                />
                            </div>
                            { !_isEmpty(company) && bankerIsSub.indexOf(company.label.toLowerCase()) !== -1 ? (
                                <>
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="The number of log" /></label>
                                        <Field
                                            name="is_sub"
                                            className="basic-single"
                                            component={renderSelectField}
                                            isSearchable={true}
                                            options={optIsSub}
                                            menuPosition="fixed"
                                            />
                                    </div>
                                    <div className="form-group">
                                        <label><TransComponent i18nKey="Permission" /></label>
                                        <Field
                                            name="is_sub"
                                            className="basic-single"
                                            component={renderSelectField}
                                            isSearchable={true}
                                            options={optIsSub}
                                            menuPosition="fixed"
                                            />
                                    </div>
                                </>
                            ) : null }
                        </>
                    ) : null }
                    <div className="form-group">
                        <label><TransComponent i18nKey="Is Active" /></label>
                        <Field
                            name="is_active"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={optAccountStatus}
                            isDisabled={true}
                            isSearchable={false}
                            />
                    </div>
                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid} onClick={this.handleSubmit}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>
            </form>
        )
    }
}

const asyncValidate = (values, dispatch, props, currentFieldName) => {
    const errors = {}
    return new Promise((resolve, reject) => {
        //Validate fullname
        if(currentFieldName === "acc_name") {
            const payload = {
                'value[acc_name]': values.acc_name,
                'value[banker_id]': values.company.value
            }
            AccountService.validatorAccount(payload).then(res => {
                if(res.status === false) {
                    errors.acc_name = res.res.data.message
                    return reject(errors)
                }
            })
        }
    });
}

const validate = values => {
    const errors = {}
    if (!_get(values, 'company.value')) {
        errors.company = 'Company is invalid'
    }
    if (!values.acc_name) {
        errors.acc_name = '"fullname" is not allowed to be empty'
    }
    if (!values.sub_code) {
        errors.sub_code = '"Sub code" is not allowed to be empty'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_account.values', {}),
        initFormData : state.AccountReducer.initFormData,
        optBanker : state.AccountReducer.optBanker,
        optAccountBelong : state.AccountReducer.optAccountBelong,
        selectedItem : state.AccountReducer.selectedItem,
        formSaveStatus : state.AccountReducer.formSaveStatus,
        formSaveResponse : state.AccountReducer.formSaveResponse,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        requestInitFormData: (accountId) => {dispatch(requestInitFormData(accountId))},
        saveAccount: payload => dispatch(saveAccount(payload)),
        resetFormSaveResponse: _ => dispatch(resetFormSaveResponse()),
    }
};

export default compose(
    reduxForm({
        form: 'form_account',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: [ 'acc_name' ]
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormAccountContainer);