import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import { reduxForm, Field } from "redux-form";
import { get as _get } from 'lodash'

import { TransComponent } from 'my-components'
import { renderSelectField, renderError } from 'my-utils/components/redux-form/render-form'
import { initAccount, initMember, initFormula, onChangeFormulaType, saveFormulaAccount, resetFormSaveResponse, initFormulaByAccount } from 'my-actions/AccountantAssignFormulaAction'

const optFormulaType = [{value: 1, label: <TransComponent i18nKey="-- formula --" />}, {value: 2, label: <TransComponent i18nKey="-- formula group --" />}]
class FormAssignContainer extends Component {

    componentWillMount() {
        this.props.initAccount()
        this.props.initMember()
        this.props.initFormula()
        this.props.initialize({...this.props.initialValues,
            formula_type: optFormulaType[0]
        })
    }

    handleChangeAccount = account => {
        const formulaBankerId = _get(this.props.initialValues, 'formula.bankerId')
        const formulaAccountId = _get(this.props.initialValues, 'formula.value')

        if (account.value !== formulaAccountId) {
            if (formulaBankerId !== account.bankerId) {
                this.props.initialize({...this.props.initialValues,
                    formula: null
                })
            }
            this.props.initFormulaByAccount(account.value)
        }
    }

    handleChangeFormulaType = formula => {
        if (formula.value !==  _get(this.props.initialValues, 'formula_type.value')) {
            this.props.initialize({...this.props.initialValues,
                formula: null
            })
            this.props.onChangeFormulaType(formula.value)
        }
    }

    handleSubmit = e => {
        const params = {
            account_select: _get(this.props.initialValues, 'account.value'),
            formula_select: _get(this.props.initialValues, 'formula.value'),
            member_select: _get(this.props.initialValues, 'member.value'),
            banker_select: _get(this.props.initialValues, 'account.bankerId'),
            select_formula_type: _get(this.props.initialValues, 'formula_type.value'),
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
            this.props.initFormulaByAccount( _get(this.props.initialValues, 'account.value'))
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formSaveResponse.message} </b></span>
                </div>
            )
        }
        return null
    }

    render() {
        const { optAccount, optMember } = this.props
        let optFormula = this.props.optFormula

        const selectedAccountBankerId = _get(this.props.initialValues, 'account.bankerId')
        if(selectedAccountBankerId) {
            optFormula = this.props.optFormula.filter(item => item.bankerId === selectedAccountBankerId)
        }
        
        const selectedFormulaTypeValue = _get(this.props.initialValues, 'formula_type.value')
        const placeholderFormula = selectedFormulaTypeValue === 1 ? <TransComponent i18nKey="-- select formula --" /> : <TransComponent i18nKey="-- Select formula group --" />

        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-body">
                    {this.renderAlert()}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Account" /></label>
                        <div className="input-group">
                            <Field
                                name="account"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optAccount}
                                placeholder={<TransComponent i18nKey="-- Select account --" />}
                                onChange={this.handleChangeAccount}
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button"><i className="fa fa-plus" /></button>
                            </span>
                        </div>
                        <Field name="account"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Member" /></label>
                        <div className="input-group">
                            <Field
                                name="member"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={false}
                                options={optMember}
                                placeholder={<TransComponent i18nKey="Account" />}
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button"><i className="fa fa-plus" /></button>
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
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula" /></label>
                        <div className="input-group">
                            <Field
                                name="formula"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optFormula}
                                placeholder={placeholderFormula}
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button"><i className="fa fa-plus" /></button>
                            </span>
                        </div>
                        <Field name="formula"component={renderError} />
                    </div>
                    <div className="form-actions text-right">
                        <button type="submit" className="btn red" disabled={this.props.invalid}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.formula) {
        errors.formula = '"Formula" is not allowed to be empty'
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
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initAccount: _ => dispatch(initAccount()),
        initMember: _ => dispatch(initMember()),
        initFormula: _ => dispatch(initFormula()),
        onChangeFormulaType: type => dispatch(onChangeFormulaType(type)),
        saveFormulaAccount: params => dispatch(saveFormulaAccount(params)),
        resetFormSaveResponse: _ => dispatch(resetFormSaveResponse()),
        initFormulaByAccount: accountId => dispatch(initFormulaByAccount(accountId)),
    };
};


export default compose(
    reduxForm({
        form: 'form_assign_formula',
        validate
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormAssignContainer)