import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { get as _get, isEmpty as _isEmpty} from 'lodash'

import { TransComponent } from 'my-components'
import { renderSelectField, renderError, renderFormatGroupLabel } from 'my-utils/components/redux-form/render-form'
import { resetData, initAccount, initMember, initFormula, onChangeFormulaType, saveFormulaAccount, resetFormSaveResponse, initFormulaByAccount } from 'my-actions/AccountantAssignFormulaAction'

import { ModalFormAccountContainer } from 'my-containers/account'
import { ModalFormMemberContainer } from 'my-containers/member'
import { ModalFormFormulaContainer } from 'my-containers/formula'
import { ModalFormAssignFormulaGroupContainer } from 'my-containers/formula-group'

import { toggleModalMember} from 'my-actions/member/MemberAction'
import { toggleModalAccount} from 'my-actions/AccountAction'
import { toggleModalFormula} from 'my-actions/formula/FormulaAction'
import { toggleModalAssignFormulaGroup} from 'my-actions/formula-group/FormulaGroupAction'

const optFormulaType = [{value: 1, label: <TransComponent i18nKey="-- formula --" />}, {value: 2, label: <TransComponent i18nKey="-- formula group --" />}]
class FormAssignContainer extends Component {

    componentWillMount() {
        console.log(this.props.rootAccInfo)
        //First Init Select When Call Component From Accountant Scan
        if(!_isEmpty(this.props.selectedAccount)) {
            this.props.initialize({...this.props.initialValues,
                formula_type: optFormulaType[0],
                account: this.props.selectedAccount
            })

            //Reload list formula
            this.props.initFormulaByAccount( _get(this.props.selectedAccount, 'value'))
        } else {
            this.props.initAccount()
            this.props.initialize({...this.props.initialValues,
                formula_type: optFormulaType[0],
            })
        }

        this.props.initMember()
        this.props.initFormula()
    }

    componentWillUnmount() {
        this.props.resetData()
    }

    componentDidUpdate() {
        if(this.props.formMemberSaveStatus === true) {
            this.props.initMember()
        }

        if(this.props.formAccountSaveStatus === true) {
            this.props.initAccount()
        }

        if(this.props.formFormulaSaveStatus === true) {
            const newFormulaId = this.props.formFormulaSaveResponse.data.formulaId
            this.props.initFormula().then(_ => {
                console.log(this.props.optFormula)
                this.props.initialize({...this.props.initialValues,
                    formula: this.props.optFormula.find(item => item.value === newFormulaId),
                })
            })
        }
    }

    handleChangeAccount = account => {
        const formulaBankerId = _get(this.props.initialValues, 'formula.bankerId')
        const formulaGroupBankerId = _get(this.props.initialValues, 'formula_group')
        const formulaAccountId = _get(this.props.initialValues, 'account.value')

        if (account.value !== formulaAccountId) {
            if (formulaBankerId !== account.bankerId || formulaGroupBankerId !== account.bankerId) {
                this.props.initialize({...this.props.initialValues,
                    formula: null,
                    formula_group: null
                })
            }
            this.props.initFormulaByAccount(account.value)
        }
    }

    handleChangeFormulaType = formula => {
        if (formula.value !==  _get(this.props.initialValues, 'formula_type.value')) {
            this.props.initialize({...this.props.initialValues,
                formula: null,
                formula_group: null
            })
            this.props.onChangeFormulaType(formula.value)
        }
    }

    handleSubmit = e => {
        const params = {
            account_select: _get(this.props.initialValues, 'account.value'),
            formula_select: _get(this.props.initialValues, 'formula.value'),
            formula_group_select: _get(this.props.initialValues, 'formula_group.value'),
            member_select: _get(this.props.initialValues, 'member.value'),
            banker_select: _get(this.props.initialValues, 'account.bankerId'),
            select_formula_type: _get(this.props.initialValues, 'formula_type.value'),
        }

        //Incase New Account - account_select = -9999
        if(!_isEmpty(this.props.selectedAccount) && !_isEmpty(this.props.rootAccInfo)) {
            params.info = JSON.stringify({
                is_accountant: true,
                acc_name: this.props.selectedAccount.label,
                account_select: this.props.selectedAccount.value,
                root: this.props.rootAccInfo,
                child: {
                    "0":{"name": this.props.rootAccInfo.acc_name},
                    "1":{"name": this.props.selectedAccount.label}
                }
            })
        }

        this.props.saveFormulaAccount(params)
        e.preventDefault();
    }

    renderAlert = _ => {
        const { formSaveStatus, formSaveResponse } = this.props
        if(formSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formSaveResponse.message} </b></span>
                </div>
            )
        } else if(formSaveStatus === true) {
            //Reload list formula
            if(!_isEmpty(formSaveResponse.account_select)) {
                this.props.initFormulaByAccount(formSaveResponse.account_select)
                // this.props.initialize({...this.props.initialValues,
                //     account: {...this.props.initialValues.account, value: formSaveResponse.account_select}
                // })

            } else {
                this.props.initFormulaByAccount( _get(this.props.initialValues, 'account.value'))
            }
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formSaveResponse.message} </b></span>
                </div>
            )
        }
        return null
    }

    renderInputAccount = _ => {
        const { optAccount } = this.props
        //First Init Select When Call Component From Accountant Scan
        if(!_isEmpty(this.props.selectedAccount)) {
            return (
                <Field
                    name="account"
                    className="basic-single"
                    component={renderSelectField}
                    isSearchable={true}
                    isDisabled={true}
                    options={[this.props.selectedAccount]}
                    formatGroupLabel={renderFormatGroupLabel}
                    />
            )
        } else {
            return (
                <>
                    <div className="input-group">
                        <Field
                            name="account"
                            className="basic-single"
                            component={renderSelectField}
                            options={optAccount}
                            placeholder={<TransComponent i18nKey="-- Select account --" />}
                            onChange={this.handleChangeAccount}
                            formatGroupLabel={renderFormatGroupLabel}
                            />
                        <span className="input-group-btn">
                            <button className="btn green" type="button" onClick={_ => this.props.toggleModalAccount()}><i className="fa fa-plus" /></button>
                        </span>
                    </div>
                    <Field name="account"component={renderError} />
                </>
            )
        }
    }

    render() {
        const { optMember } = this.props
        let optFormula = this.props.optFormula

        const selectedAccountBankerId = _get(this.props.initialValues, 'account.bankerId')
        if(selectedAccountBankerId) {
            optFormula = this.props.optFormula.filter(item => item.bankerId === selectedAccountBankerId)
        }
        const selectedFormulaTypeValue = _get(this.props.initialValues, 'formula_type.value')

        return (
            <form name="form_assign_formula" onSubmit={this.handleSubmit}>
                <div className="form-body">
                    {this.renderAlert()}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Account" /></label>
                        {this.renderInputAccount()}
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Member" /></label>
                        <div className="input-group">
                            <Field
                                name="member"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optMember}
                                placeholder={<TransComponent i18nKey="Member" />}
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button" onClick={_ => this.props.toggleModalMember()}><i className="fa fa-plus" /></button>
                            </span>
                        </div>
                        <Field name="member"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Type" /></label>
                        <Field
                            name="formula_type"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={optFormulaType}
                            onChange={this.handleChangeFormulaType}
                            />
                    </div>
                    {
                        
                        selectedFormulaTypeValue === 1 ?
                            <div className="form-group">
                                <label><TransComponent i18nKey="Formula" /></label>
                                <div className="input-group">
                                    <Field
                                        name='formula'
                                        className="basic-single"
                                        component={renderSelectField}
                                        isSearchable={true}
                                        options={optFormula}
                                        placeholder={<TransComponent i18nKey="-- select formula --" />}
                                        />
                                    <span className="input-group-btn">
                                        <button className="btn green" type="button" onClick={_ => this.props.toggleModalFormula()}><i className="fa fa-plus" /></button>
                                    </span>
                                </div>
                                <Field name="formula"component={renderError} />
                            </div>
                        :
                        <div className="form-group">
                            <label><TransComponent i18nKey="Formula" /></label>
                            <div className="input-group">
                                <Field
                                    name='formula_group'
                                    className="basic-single"
                                    component={renderSelectField}
                                    isSearchable={true}
                                    options={optFormula}
                                    placeholder={<TransComponent i18nKey="-- Select formula group --" />}
                                    />
                                <span className="input-group-btn">
                                    <button className="btn green" type="button" onClick={_ => this.props.toggleModalAssignFormulaGroup() }><i className="fa fa-plus" /></button>
                                </span>
                            </div>
                            <Field name="formula"component={renderError} />
                        </div>
                    }
                    
                    <div className="form-actions text-right">
                        <button type="submit" className="btn red" disabled={this.props.invalid}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>

                {/* <ModalFormAccountContainer isOpen={true} toggle={_ => null} formType="create" /> */}
                <ModalFormAccountContainer formType="create" />
                <ModalFormMemberContainer formType="create" />
                <ModalFormFormulaContainer formType="create" defaultBankerId={selectedAccountBankerId}/>
                <ModalFormAssignFormulaGroupContainer formType="create" defaultBankerId={selectedAccountBankerId}/>
            </form>
        );
    }
}

const validate = values => {
    const errors = {}
    if (_get(values, 'formula_type.value') === 1 && !values.formula) {
        errors.formula = '"Formula" is not allowed to be empty'
    }
    if (_get(values, 'formula_type.value') === 2 && !values.formula_group) {
        errors.formula = '"Formula Group" is not allowed to be empty'
    }
    if (!values.account) {
        errors.account = '"account" is not allowed to be empty'
    }
    if (!values.member) {
        errors.member = '"member" is not allowed to be empty'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_assign_formula.values'),
        optAccount: state.AccountantAssignFormulaReducer.optAccount,
        optMember: state.AccountantAssignFormulaReducer.optMember,
        optFormula: state.AccountantAssignFormulaReducer.optFormula,
        formSaveStatus: state.AccountantAssignFormulaReducer.formSaveStatus,
        formSaveResponse: state.AccountantAssignFormulaReducer.formSaveResponse,

        //Response Modal Member Saved
        formMemberSaveStatus: state.member.formSaveStatus,

        //Response Modal Account Saved
        formAccountSaveStatus: state.AccountReducer.formSaveStatus,

        //Response Modal Formula Saved
        formFormulaSaveStatus: state.FormulaReducer.formSaveStatus,
        formFormulaSaveResponse: state.FormulaReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        resetData: _ => dispatch(resetData()),
        initAccount: _ => dispatch(initAccount()),
        initMember: _ => dispatch(initMember()),
        initFormula: async _ => dispatch(initFormula()),
        onChangeFormulaType: type => dispatch(onChangeFormulaType(type)),
        saveFormulaAccount: params => dispatch(saveFormulaAccount(params)),
        resetFormSaveResponse: _ => dispatch(resetFormSaveResponse()),
        initFormulaByAccount: accountId => dispatch(initFormulaByAccount(accountId)),
        // Handle Modal Form Account
        toggleModalAccount:  _ => dispatch(toggleModalAccount()),
        // Handel Modal Form Member
        toggleModalMember:  _ => dispatch(toggleModalMember()),
        // Handel Modal Form Formula
        toggleModalFormula:  _ => dispatch(toggleModalFormula()),
        
        // Handel Modal Form Formula Group
        toggleModalAssignFormulaGroup:  _ => dispatch(toggleModalAssignFormulaGroup()),
        
    };
};


export default compose(
    reduxForm({
        form: 'form_assign_formula',
        validate
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormAssignContainer)