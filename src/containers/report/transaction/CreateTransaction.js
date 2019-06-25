import React, {Component} from 'react'
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "redux";
import {withTranslation} from "react-i18next";
import MemberContainer from 'my-containers/member/MemberContainer'

import { isEmpty} from 'lodash'
import {getCycle, getTypeOfMoney, getMember} from "my-actions/report/TransactionAction";

class CreateTransaction extends Component{
    constructor(props){
        super(props);
        this.state = {
            selectedTransaction: '',
            selectedMoney: '',
            selectedCycle: '',
        }
        this.handleTransactionChange = this.handleTransactionChange.bind(this);
        this.handleMoneyChange = this.handleMoneyChange.bind(this);
        this.handleCycleChange = this.handleCycleChange.bind(this);
    }

    componentWillMount() {
        this.props.getCycle();
        this.props.getTypeOfMoney();
    }

    handleTransactionChange(e) {
        this.setState({
            selectedTransaction: e.target.value
        });
    }

    handleMoneyChange(e) {
        this.setState({
            selectedMoney: e.target.value
        });
    }

    handleCycleChange(e){
        this.setState({
            selectedCycle: e.target.value
        });
    }

    render() {

        var DATA_CYCLE = this.props.transaction.cycle;
        var DATA_MONEY = this.props.transaction.money;
        if(isEmpty(DATA_CYCLE) || isEmpty(DATA_MONEY)) {
            return null;
        }
        var money = DATA_MONEY.res.data;
        var cycleList = DATA_CYCLE.res.data.List

        var OptionsCycle = cycleList.map(function (item) {
            return (
                <option key={item.id} value={item.chuky}> {item.chuky} </option>
            )
        })


        var TypeOfMoney = money.map( item => {
            return(
                <label key={item.id} className="mt-radio mt-radio-outline">
                    <input type="radio" name={item.name} id={item.name} value={item.name}
                           checked={this.state.selectedMoney === item.name} onChange={this.handleMoneyChange}/>
                    {item.name}
                    <span></span>
                </label>
            )
        })



        const { t } = this.props
        return (
            <div className="row">
                {/*<MemberContainer/>*/}
                <form action="#" className="form-horizontal form-bordered">
                    <div className="form-body">
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Member")} </label>
                            <div className="col-md-8">
                                <MemberContainer/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Cycle")} </label>
                            <div className="col-md-8">
                                <select value={this.state.selectedCycle} onChange={this.handleCycleChange}>
                                    <option value="Select cycle"> Select cycle </option>
                                    {OptionsCycle}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Currency")} </label>
                            <div className="col-md-8">
                                <div className="mt-radio-list">
                                    {TypeOfMoney}
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Transaction Type")} </label>
                            <div className="col-md-8">
                                <div className="mt-radio-list">
                                    <label className="mt-radio mt-radio-outline">
                                        <input type="radio" name="paymentRadios" id="payment" value="payment"
                                               checked={this.state.selectedTransaction === 'payment'} onChange={this.handleTransactionChange}/>
                                            Payment
                                        <span></span>
                                    </label>

                                    <label className="mt-radio mt-radio-outline">
                                        <input type="radio" name="otherRadios" id="other" value="other"
                                               checked={this.state.selectedTransaction === 'other'} onChange={this.handleTransactionChange}/>
                                            Other
                                        <span></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Amount")} </label>
                            <div className="col-md-8">
                                <input className="form-control" id="mask_date1" type="text"/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-md-3"> {t("Note")} </label>
                            <div className="col-md-8">
                                <textarea className="form-control autosizeme" type="textarea"></textarea>
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
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateTransaction);