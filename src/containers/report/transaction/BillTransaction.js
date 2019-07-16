import React, {Component} from 'react'
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import { Helpers } from 'my-utils'
import {get as _get, isEmpty, keyBy} from 'lodash'

import {getDetailReport} from "my-actions/report/TransactionAction";
import { TransComponent } from 'my-components'

class BillTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            typeOfMoney: '',
            transactionMethod: '',
            amount: '',
            rowInTable: false,
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    changeStateBillTransaction = (rowInTable) => {
        this.setState({
            rowInTable: rowInTable
        })
    }

    callBillTransaction = (memberValues, cycleValues, typeOfMoney, transactionMethod, amount) => {
        if(memberValues){
            var memberId = memberValues.value;
        }
        if(cycleValues){
            var cycleId = cycleValues.value;
        }
        var post = {
            memberId: memberId,
            cycleId: cycleId
        };
        this.props.getDetailReport(post);
        if(memberValues && cycleValues && typeOfMoney && transactionMethod && amount){
            this.setState({
                typeOfMoney: typeOfMoney,
                transactionMethod: transactionMethod,
                amount: amount,
                rowInTable: true,
            })
        }
        if(Number.isNaN(amount)){
            this.setState({
                rowInTable: false,
            })
        }
    };

    render() {
        const {currencyMap, result, total, optMoney} = this.props;
        if (isEmpty(currencyMap) || isEmpty(result) || isEmpty(total)) {
            return null;
        }
        var resultMap = Object.entries(result);
        let map_currency = keyBy(currencyMap, 'dv_tien_te_id');
        let currencyIDs = currencyMap.map(function (currency) {
            return currency.dv_tien_te_id;
        }).sort().reverse();

        var typeOfMoney = this.state.typeOfMoney;
        var transactionMethod = this.state.transactionMethod;
        var amount = this.state.amount;
        var transaction;
        if(transactionMethod === "2"){
            transaction = "Payment";
        } else {
            transaction = "Other";
        }
        let mapOptMoney = keyBy(optMoney, 'value')
        mapOptMoney = Object.entries(mapOptMoney);

        var found = false;
        let headers = currencyIDs.map(function (id) {
            if(typeOfMoney === id){
                found = true
            }
            return(
                <th key={id} className="caption-subject font-red text-center"> {map_currency[id].dv_tien_te} </th>
            )
        });
        //Khai bao Header
        let rowNew = currencyIDs.map(function (id) {
            return(
                <td key={id} className="caption-subject font-green text-center">
                    {typeOfMoney === id ?
                    amount < 0 ? <span className="font-red"> {Helpers.formatMoney(amount,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(amount,0)} </span> : ''}
                </td>
            )
        })
        //Khai bao Content
        let tdMain;
        let rowMain = resultMap.map( (item, index) => {
            var total = item[1].total;
            tdMain = currencyIDs.map(id => {
                return (
                    <td key={id} className="caption-subject font-green text-right">
                        {this.state.rowInTable ?
                            item[1].name == transaction ?
                                (typeOfMoney === id ? (total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)),0)} </span>
                                    : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>)
                                : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>
                            : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>
                        }
                    </td>
            )})
            //Them column cho loai tien moi
            if(!found){
                if(amount){
                    if(item[1].name == transaction){
                        tdMain.push(
                            <td key={typeOfMoney} className="caption-subject font-green text-right">
                                {amount < 0 ? <span className="font-red"> {Helpers.formatMoney(amount,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(amount,0)} </span>}
                            </td>
                        )
                    } else {
                        tdMain.push(
                            <td key={typeOfMoney} className="caption-subject font-green text-right">
                                <span className="font-blue-steel"> 0 </span>
                            </td>
                        )
                    }
                }
            }
            return (
                <tr key={index}>
                    <td> <TransComponent i18nKey={item[1].name}/></td>
                    {tdMain}
                </tr>
            )
        });
        //Khai bao Total
        let rowTotal = currencyIDs.map(id => {
            return (
                <td key={id} className="caption-subject font-green text-right">
                    {this.state.rowInTable ?
                        (typeOfMoney === id ? (Number(total[id].result) + Number(amount)) < 0 ? <span className="font-red"> {Helpers.formatMoney((Number(total[id].result) + Number(amount)),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((Number(total[id].result) + Number(amount)),0)} </span>
                            : total[id].result < 0 ? <span className="font-red"> {Helpers.formatMoney(total[id].result,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(total[id].result,0)} </span>)
                        : total[id].result < 0 ? <span className="font-red"> {Helpers.formatMoney(total[id].result,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(total[id].result,0)} </span>
                    }
                </td>
            )
        });
        //Them giao dich cho loai tien moi
        var itemNew = null;
        if(!found){
            mapOptMoney.forEach(function (item) {
                if(item[1].value == typeOfMoney){
                    itemNew = item;
                    return true;
                }
                return false;
            })
            if(itemNew){
                headers.push(
                    <th key={itemNew.value} className="caption-subject font-red text-center"> {itemNew[1].label} </th>
                )

                rowNew.push(
                    <td className="caption-subject font-green text-center">
                        {amount < 0 ? <span className="font-red"> {Helpers.formatMoney(amount,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(amount,0)} </span>}
                    </td>
                )

                rowTotal.push(
                    <td className="caption-subject font-green text-right">
                        {amount < 0 ? <span className="font-red"> {Helpers.formatMoney(amount,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(amount,0)} </span>}
                    </td>
                )
            }
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-social-dribbble font-green hide"></i>
                        <span className="caption-subject font-dark bold">
                            <i className="fa fa-calculator" />&nbsp;&nbsp;
                            <TransComponent i18nKey="invoice" />
                        </span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                            <thead>
                            <tr role="row">
                                <th></th>
                                {headers}
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.rowInTable ?
                                <tr>
                                    <td> <TransComponent i18nKey={transaction}/> </td>
                                    {rowNew}
                                </tr> : <tr></tr>}
                            {rowMain}
                            <tr>
                                <td><TransComponent i18nKey="Total"/></td>
                                {rowTotal}
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.billTransaction.values'),
        currencyMap: state.TransactionReducer.currencyMap,
        result: state.TransactionReducer.result,
        total: state.TransactionReducer.total,
        optMoney: state.TransactionReducer.optMoney,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDetailReport: params => {dispatch(getDetailReport(params))},
    }
};

export default compose(
    reduxForm({form: 'billTransaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(BillTransaction);