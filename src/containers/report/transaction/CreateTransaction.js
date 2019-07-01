import React, {Component} from 'react'
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import MemberContainer from 'my-containers/member/MemberContainer'

import { isEmpty} from 'lodash'
import {getCycle, getTypeOfMoney, saveTransaction, getAllTransaction} from "my-actions/report/TransactionAction";

class CreateTransaction extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTransaction: '',
            selectedTypeOfMoney: '',
            selectedCycle: '',
            selectedMember: '',
            transaction: '',
            note:'',
            isEdit: false,
            idEdit:'',
            showBill: false,

            editValue: this.props.editValue,
        }
    }

    componentWillMount() {
        this.props.getCycle();
        this.props.getTypeOfMoney();
    }

    componentDidMount() {
        this.props.onRef(this)
    }
    componentWillUnmount() {
        this.props.onRef(undefined)
    }
    callCreateTransaction = (item) => {
        this.setState({
            selectedTransaction: item.type_report,
            selectedTypeOfMoney: item.dv_tien_te_id,
            selectedCycle: item.chukybaocaotuan_id,
            selectedMember: item.user_id,
            transaction: item.result,
            note: item.note,
            idEdit: item.id,
            isEdit: true,
        })
    }

    onClickAddNew = () => {
        this.setState({
            selectedTransaction: '',
            selectedTypeOfMoney: '',
            selectedCycle: '',
            selectedMember: '',
            transaction: '',
            note: '',
            idEdit: '',
            isEdit: false,
        })
    }

    callbackFromChildHandlerFunction = (changeMember) => {
        this.setState({
            selectedMember: changeMember,
            showBill: true,
        });
        var Data = {
            showBill: true,
            memberId: changeMember,
        }
        this.props.callParentFromCreateTransaction(Data);
    }
    onInputChange = (e) => {
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name] : value,
        })
    }

    handleTransactionChange = (e) => {
        this.setState({
            selectedTransaction: e.target.value
        });
    }

    handleTypeOfMoneyChange = (e) => {
        this.setState({
            selectedTypeOfMoney: e.target.value,
        });
    }

    handleCycleChange = (e) => {
        this.setState({
            selectedCycle: e.target.value,
            showBill: true,
        })
        var Data = {
            showBill: true,
            cycleId: e.target.value,
        }
        this.props.callParentFromCreateTransaction(Data);
    }

    submitForm = (e) => {
        e.preventDefault();
        var post = {
            currency_type_id: this.state.selectedTypeOfMoney,
            member_select: this.state.selectedMember,
            transaction: this.state.transaction,
            transaction_type: this.state.selectedTransaction,
            note: this.state.note,
            isEdit: this.state.isEdit,
            id: this.state.idEdit,
            chu_ky_id: this.state.selectedCycle,
            // id: this.state.idEdit,
        }
        var self = this;
        this.props.saveTransaction({data: JSON.stringify(post)})
            .then(function () {
                self.setState({
                    selectedTransaction: '',
                    selectedTypeOfMoney: '',
                    selectedCycle: '',
                    selectedMember: '',
                    transaction: '',
                    note: '',
                    idEdit: '',
                    isEdit: false,
                    showBill: false,
                })
            })
            .then(function () {
                var Data = {
                    showBill: self.state.showBill,
                }
                self.props.callParentFromCreateTransaction(Data);
            })
            .then(function () {
                self.props.getAllTransaction()
            })
            .catch(function (err) {
                console.log(err)
            })
    }

    render() {
        var typeOfTransaction = [
            {id: 2, name: 'Payment'},
            {id: 9, name: 'Other'}
        ]

        var DATA_CYCLE = this.props.transaction.cycle;
        var DATA_MONEY = this.props.transaction.money;
        if(isEmpty(DATA_CYCLE) || isEmpty(DATA_MONEY)) {
            return null;
        }
        var money = DATA_MONEY.res.data;
        var cycleList = DATA_CYCLE.res.data.List


        var optionsCycle = cycleList.map(function (item) {
            return (
                <option key={item.id} value={item.id}> {item.chuky} </option>
            )
        })
        var optionsMoney = money.map( item => {
            return(
                <label key={item.id} className="mt-radio mt-radio-outline">
                    <input type="radio" name={item.name} id={item.name} value={item.id}
                           checked={this.state.selectedTypeOfMoney === item.id} onChange={this.handleTypeOfMoneyChange}/>
                    {item.name}
                    <span></span>
                </label>
            )
        })
        var optionsTransaction = typeOfTransaction.map( item => {
            return(
                <label key={item.id} className="mt-radio mt-radio-outline">
                    <input type="radio" name={item.name} id={item.name} value={item.id}
                           checked={this.state.selectedTransaction == item.id} onChange={this.handleTransactionChange}/>
                    {item.name}
                    <span></span>
                </label>
            )
        })

        const { t } = this.props
        const {transaction, note} = this.state;
        return (
            <div className="row">
                {/*<MemberContainer/>*/}
                <form action="#" className="form-horizontal form-bordered" onSubmit={this.submitForm}>
                    <div className="form-body">
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Member")} </label>
                            <div className="col-md-8">
                                <MemberContainer changeSelectedMember = {this.callbackFromChildHandlerFunction}
                                                 selectedMember = {this.state.selectedMember}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Cycle")} </label>
                            <div className="col-md-8">
                                <select value={this.state.selectedCycle} onChange={this.handleCycleChange}>
                                    <option value="Select cycle"> {t("Select cycle")} </option>
                                    {optionsCycle}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Currency")} </label>
                            <div className="col-md-8">
                                <div className="mt-radio-list">
                                    {optionsMoney}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Transaction Type")} </label>
                            <div className="col-md-8">
                                <div className="mt-radio-list">
                                    {optionsTransaction}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Amount")} </label>
                            <div className="col-md-8">
                                <input className="form-control" type="text" name="transaction"
                                       value={transaction} onChange={this.onInputChange}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Note")} </label>
                            <div className="col-md-8">
                                <textarea className="form-control autosizeme" type="textarea" name="note"
                                          value={note} onChange={this.onInputChange}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="form-actions">
                        <div className="row">
                            <div className="col-md-offset-3 col-md-9">
                                {this.state.isEdit ? (<button type="submit" className="btn red" onClick={this.onClickAddNew}>
                                                        <i className="fa fa-plus"></i> {t("Add new")}
                                                        </button>) : ''}
                                <button type="submit" className="btn dark">
                                    <i className="fa fa-check"></i> {t("Save")}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.transaction){
        initialValues = state.form.transaction.values;
    }
    return {initialValues, auth: state.AuthReducer, transaction: state.transaction}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCycle: params => {dispatch(getCycle(params))},
        getTypeOfMoney: params => {dispatch(getTypeOfMoney(params))},
        saveTransaction: params => dispatch(saveTransaction(params)),
        getAllTransaction: params => {dispatch(getAllTransaction(params))},
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateTransaction);