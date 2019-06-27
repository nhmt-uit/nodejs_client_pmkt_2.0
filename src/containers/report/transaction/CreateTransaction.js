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
            selectedMoney: '',
            selectedCycle: '',
            selectedMember: '',
            transaction: '',
            note:'',
            isEdit: false,

        }
        this.handleTransactionChange = this.handleTransactionChange.bind(this);
        this.handleMoneyChange = this.handleMoneyChange.bind(this);
        this.handleCycleChange = this.handleCycleChange.bind(this);
        this.onInputChange = this.onInputChange.bind(this);
        this.submitForm = this.submitForm.bind(this);
    }

    componentWillMount() {
        this.props.getCycle();
        this.props.getTypeOfMoney();
    }

    callbackFromChildHandlerFunction = (changeMember) => {
        this.setState({
            selectedMember: changeMember,
        });
    }
    onInputChange(e){
        let name = e.target.name;
        let value = e.target.value;
        this.setState({
            [name] : value,
        })
    }

    handleTransactionChange(e) {
        this.setState({
            selectedTransaction: e.target.value
        });
    }

    handleMoneyChange(e) {
        this.setState({
            selectedMoney: e.target.value,
        });
    }

    handleCycleChange(e){
        this.setState({
            selectedCycle: e.target.value
        });
    }

    submitForm(e){
        e.preventDefault();
        var post = {
            currency_type_id: this.state.selectedMoney,
            member_select: this.state.selectedMember,
            transaction: this.state.transaction,
            transaction_type: this.state.selectedTransaction,
            note: this.state.note,
            isEdit: this.state.isEdit,
            chu_ky_id: this.state.selectedCycle,
            // id: this.state.idEdit,
        }
        this.props.saveTransaction({data: JSON.stringify(post)})
        // this.setState({
        //     selectedTransaction: '',
        //     selectedMoney: '',
        //     selectedCycle: '',
        //     selectedMember: '',
        //     transaction: '',
        //     note:'',
        //     isEdit: false,
        // })
        // this.props.getAllTransaction()

    }

    render() {
        var typeOfTransaction = [
            {id: '2', name: 'Payment'},
            {id: '9', name: 'Other'}
        ]

        console.log("STATE", this.state)
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
                           checked={this.state.selectedMoney === item.id} onChange={this.handleMoneyChange}/>
                    {item.name}
                    <span></span>
                </label>
            )
        })
        var optionsTransaction = typeOfTransaction.map( item => {
            return(
                <label key={item.id} className="mt-radio mt-radio-outline">
                    <input type="radio" name={item.name} id={item.id} value={item.id}
                           checked={this.state.selectedTransaction === item.id} onChange={this.handleTransactionChange}/>
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
                                <MemberContainer changeSelectedMember = {this.callbackFromChildHandlerFunction}/>
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
        saveTransaction: params => {dispatch(saveTransaction(params))},
        getAllTransaction: params => {dispatch(getAllTransaction(params))},
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateTransaction);