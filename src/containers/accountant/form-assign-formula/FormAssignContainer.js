import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import Select from 'react-select';
import { reduxForm, Field } from "redux-form";
import { get as _get } from 'lodash'

import { TransComponent } from 'my-components'
import { AccountService } from 'my-services/account'
import { MemberService } from 'my-services/member'
import { FormulaService } from 'my-services/formula'
import { renderSelectField, renderError } from 'my-utils/components/redux-form/render-form'

const required = value => value ? undefined : 'Required'
const optFormulaType = [{value: 1, label: <TransComponent i18nKey="-- formula --" />}, {value: 2, label: <TransComponent i18nKey="-- formula group --" />}]
class FormAssignContainer extends Component {
    state = {
        optAccount: [],
        optMember: [],
        optFormula: [],
        originalOptFormula: []
    }

    componentWillMount() {
        this.initAccount()
        this.initMember()
        this.initFormula()

        this.props.initialize({...this.props.initialValues,
            formula_type: optFormulaType[0]
        })
        
        
    }
    
    initAccount = _ => {
        AccountService.getAccount().then(res => {
            if (res.status) {
                const optAccount = res.res.data.bankerAccountMap
                this.setState({optAccount})
            }
        })
    }
    
    initMember = _ => {
        MemberService.getMember().then(res => {
            if (res.status) {
                const optMember = res.res.data.List.map(item => {
                    return {value: item.id, label: item.fullname.toUpperCase()}
                })
                this.setState({optMember})
            }
        })
    }

    initFormula = _ => {
        FormulaService.getFormula().then(res => {
            if (res.status) {
                let listData = res.res.data.List
                const optFormula = listData.map(item => {
                    return {value: item.id, label: item.tenct.toUpperCase(), bankerId: item.banker_id}
                })
                this.setState({optFormula, originalOptFormula: optFormula})
            }
        })
    }

    handleChangeAccount = account => {
        const formulaBankerId = _get(this.props.initialValues, 'formula.bankerId')

        if (formulaBankerId !== account.bankerId) {
            this.props.initialize({...this.props.initialValues,
                formula: null
            })
        }

        const optFormula = this.state.originalOptFormula.filter(item => item.bankerId === account.bankerId)
        this.setState({optFormula})
        
    }

    handleSubmit = e => {
        console.log(this.props.initialValues)
        const params = {
            account_select: _get(this.props.initialValues, 'account.value'),
            formula_select: _get(this.props.initialValues, 'formula.value'),
            member_select: _get(this.props.initialValues, 'member.value'),
            banker_select: _get(this.props.initialValues, 'account.bankerId'),
            select_formula_type: _get(this.props.initialValues, 'formula_type.value'),
        }
        FormulaService.saveFormulaAccount(params).then(res => {
            console.log(res)
        })
        e.preventDefault();
    }

    render() {
        const { optAccount, optMember, optFormula } = this.state
        console.log(this.props.invalid)
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-body">
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
                                placeholder={<TransComponent i18nKey="-- select formula --" />}
                                validate={[ required ]}
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
        initialValues: _get(state, 'form.form_assign_formula.values', {}),
    }
};


export default compose(
    reduxForm({
        form: 'form_assign_formula',
        validate
    }),
    connect(mapStateToProps, null),
)(FormAssignContainer)