import React, {Component} from 'react'
import {Field, reduxForm, reset} from "redux-form";
import {connect} from "react-redux";
import {compose} from "redux";

import {withTranslation} from "react-i18next";
import {renderSelectField, renderError} from 'my-utils/components/redux-form/render-form'
import { ModalFormMemberContainer } from 'my-containers/member'

import {getCycle, getTypeOfMoney, saveTransaction, resetFormSaveResponse, getAllTransaction} from "my-actions/report/TransactionAction";
import {getMember, toggleModalMember} from "my-actions/member/MemberAction";
import {isEmpty, get as _get} from 'lodash'

class CreateTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            submit: true,
        }
    }

    componentWillMount() {
        this.props.getCycle();
        this.props.getTypeOfMoney();
        this.props.getMember();
    }

    componentDidUpdate() {
        if(this.props.formMemberSaveStatus === true) {
            this.props.getMember()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.initialValues){
            var memberValues = nextProps.initialValues.member;
            var cycleValues = nextProps.initialValues.cycle;
            var typeOfMoney = nextProps.initialValues.typeOfMoney;
            var transactionMethod = nextProps.initialValues.transactionMethod;
            var amount = nextProps.initialValues.amount;
            if (memberValues && cycleValues && typeOfMoney && transactionMethod && amount !== undefined && amount!==''){
                this.setState({
                    submit: false
                })
            } else {
                this.setState({
                    submit: true
                })
            }

            if(nextProps.initialValues.member || nextProps.initialValues.cycle){
                this.props.callParentFromCreateTransaction(memberValues, cycleValues, typeOfMoney, transactionMethod, amount)
            }
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    callCreateTransaction = (item) => {
        this.setState({
            isEdit: true,
        })
        const {optCycle, optMember} = this.props
        this.props.initialize({
            ...this.props.initialValues,
            member: optMember.filter(obj => obj.value === item.user_id),
            cycle: optCycle.filter(obj => obj.value === item.chukybaocaotuan_id),
            typeOfMoney: item.dv_tien_te_id,
            transactionMethod: item.type_report.toString(),
            amount: item.result,
            note: item.note,
            idEdit: item.id,
            isEdit: true,
        })

    }

    onClickAddNew = (e) => {
        this.setState({
            isEdit: false,
            submit: true,
        })
        e.preventDefault();
        this.props.destroy('createTransaction');
    }

    submitForm = (e) => {
        e.preventDefault();
        var post = {
            member_select: _get(this.props.initialValues, 'member.value') || _get(this.props.initialValues, 'member[0].value'),
            chu_ky_id: _get(this.props.initialValues, 'cycle.value') || _get(this.props.initialValues, 'cycle[0].value'),
            currency_type_id: _get(this.props.initialValues, 'typeOfMoney'),
            transaction_type: _get(this.props.initialValues, 'transactionMethod'),
            transaction: _get(this.props.initialValues, 'amount'),
            note: _get(this.props.initialValues, 'note'),
            isEdit: _get(this.props.initialValues, 'isEdit', false),
            id: _get(this.props.initialValues, 'idEdit', null),
        }
        var self = this;
        this.props.saveTransaction({data: JSON.stringify(post)})
            .then(function () {
                self.props.destroy('createTransaction');
            })
            .then(function () {
                self.setState({
                    isEdit: false,
                })
            })
            .then(function () {
                self.props.getAllTransaction()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    renderAlert = _ => {
        const {formSaveStatus, formSaveResponse} = this.props
        if (formSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse}/>
                    <span><b> {formSaveResponse.data.message} </b></span>
                </div>
            )
        } else if (formSaveStatus === true) {
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> Successful! </b></span>
                </div>
            )
        }
    };
    render() {
        var typeOfTransaction = [
            {value: "2", label: 'Payment'},
            {value: "9", label: 'Other'}
        ]
        //Get data Cycle
        const {optCycle, optMoney, optMember} = this.props

        if (isEmpty(optMoney) || isEmpty(optCycle)) {
            return null;
        }
        var optionsMoney = optMoney.map(item => {
            return (
                <label key={item.value} className="mt-radio mt-radio-outline col-md-6">
                    <Field
                        name="typeOfMoney"
                        component="input"
                        type="radio"
                        value={item.value}
                    />
                    {item.label}
                    <span></span>
                </label>
            )
        })

        var optionsTransaction = typeOfTransaction.map(item => {
            return (
                <label key={item.value} className="mt-radio mt-radio-outline">
                    <Field
                        name="transactionMethod"
                        component="input"
                        type="radio"
                        value={item.value}
                    />
                    {item.label}
                    <span></span>
                </label>
            )
        })

        const {t} = this.props

        return (
            <div className="row">
                <form action="#" className="form-horizontal form-bordered" onSubmit={this.submitForm}>
                    <div className="form-body">
                        {this.renderAlert()}
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Member")} </label>
                            <div className="input-group col-md-8">
                                <Field
                                    name="member"
                                    className="basic-single"
                                    component={renderSelectField}
                                    isSearchable={true}
                                    options={optMember}
                                    placeholder="--Select Member--"
                                />
                                <span className="input-group-btn">
                                    <button className="btn green" type="button" onClick={_ => this.props.toggleModalMember()}><i className="fa fa-plus"/></button>
                                </span>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-7">
                                <Field name="member" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3">{t("Cycle")}</label>
                            <div className="input-group col-md-8">
                                <Field
                                    name="cycle"
                                    className="basic-single"
                                    component={renderSelectField}
                                    isSearchable={false}
                                    options={optCycle}
                                    placeholder="-- Select Cycle --"

                                />
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-7">
                                <Field name="cycle" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Currency")} </label>
                            <div className="col-md-8 mt-radio-list">
                                {optionsMoney}
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-7">
                                <Field name="typeOfMoney" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Transaction Type")} </label>
                            <div className="col-md-8">
                                <div className="mt-radio-list">
                                    {optionsTransaction}
                                </div>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-7">
                                <Field name="transactionMethod" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Amount")} </label>
                            <div className="col-md-8">
                                <Field className="form-control" component="input" name="amount" type="text"/>
                            </div>
                            <div className="col-md-3"></div>
                            <div className="col-md-7">
                                <Field name="amount" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Note")} </label>
                            <div className="col-md-8">
                                <Field className="form-control" component="textarea" name="note"/>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <div className="row">
                            <div className="col-md-offset-3 col-md-9">
                                {this.state.isEdit ? (
                                    <button type="submit" className="btn red" onClick={this.onClickAddNew}>
                                        <i className="fa fa-plus"></i> {t("Add new")}
                                    </button>) : ''}
                                <button type="submit" className="btn dark" disabled={this.state.submit}>
                                    <i className="fa fa-check"></i> {t("Save")}
                                </button>
                            </div>
                        </div>
                    </div>
                    <ModalFormMemberContainer />
                </form>
            </div>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.cycle) {
        errors.cycle = '"Cycle" is not allowed to be empty!'
    }
    if (!values.member) {
        errors.member = '"Member" is not allowed to be empty!'
    }
    if (!values.typeOfMoney) {
        errors.typeOfMoney = 'You need to choose a currency!'
    }
    if (!values.amount) {
        errors.amount = '"Amount" is not allowed to be empty!'
    } else if (values.amount && isNaN(Number(values.amount))) {
        errors.amount = '"Amount" must is a number!'
    }
    if (!values.transactionMethod) {
        errors.transactionMethod = 'You need to choose a transaction method!'
    }
    return errors
}

const mapStateToProps = (state) => {
    return {
        initialValues: _get(state, 'form.createTransaction.values'),
        optCycle: state.TransactionReducer.optCycle,
        optMoney: state.TransactionReducer.optMoney,
        optMember: state.MemberReducer.optMember,
        formSaveStatus: state.TransactionReducer.formSaveStatus,
        formSaveResponse: state.TransactionReducer.formSaveResponse,
        formMemberSaveStatus: state.member.formSaveStatus,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCycle: params => {dispatch(getCycle(params))},
        getTypeOfMoney: params => {dispatch(getTypeOfMoney(params))},
        getMember: params => {dispatch(getMember(params))},
        getAllTransaction: params => {dispatch(getAllTransaction(params))},
        saveTransaction: params => dispatch(saveTransaction(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
        toggleModalMember:  _ => dispatch(toggleModalMember()),
    };
};

export default compose(
    reduxForm({
        form: 'createTransaction',
        validate,
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateTransaction);