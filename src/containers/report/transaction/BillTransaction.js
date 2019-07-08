import React, {Component} from 'react'
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import { Helpers } from 'my-utils'
import {get as _get, isEmpty, keyBy} from 'lodash'
import {getDetailReport} from "my-actions/report/TransactionAction";

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
        var self = this;
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
        let headers = currencyIDs.map(function (id) {
            return(
                <th key={id} className="caption-subject font-red text-center"> {map_currency[id].dv_tien_te} </th>
            )
        });

        let test = currencyIDs.map(function (id) {
            return(
                <td key={id} className="caption-subject font-green text-center">
                    {typeOfMoney === id ?
                    amount < 0 ? <span className="font-red"> {Helpers.formatMoney(amount,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(amount,0)} </span> : ''}
                </td>
            )
        })

        let rows = currencyIDs.map(function (id) {
            return (
                <td key={id} className="caption-subject font-green text-center">
                    {self.state.rowInTable ?
                        (typeOfMoney === id ? (Number(total[id].result) + Number(amount)) < 0 ? <span className="font-red"> {Helpers.formatMoney((Number(total[id].result) + Number(amount)),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((Number(total[id].result) + Number(amount)),0)} </span>
                            : total[id].result < 0 ? <span className="font-red"> {Helpers.formatMoney(total[id].result,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(total[id].result,0)} </span>)
                        : total[id].result < 0 ? <span className="font-red"> {Helpers.formatMoney(total[id].result,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(total[id].result,0)} </span>
                    }
                </td>
            )
        });
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-social-dribbble font-green hide"></i>
                        <span className="caption-subject font-dark bold"> <i
                            className="fa fa-calculator"></i> Bill </span>
                    </div>
                </div>
                <div className="portlet-body">
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
                                <td> {transaction} </td>
                                {test}
                            </tr> : <tr></tr>}
                        {resultMap.map(function (item, index) {
                            var total = item[1].total;
                            return (
                                <tr key={index}>
                                    <td> {item[1].name}</td>
                                    {
                                        currencyIDs.map(function (id) {
                                            return (
                                                <td key={id} className="caption-subject font-green text-center">
                                                    {self.state.rowInTable ?
                                                        item[1].name == transaction ?
                                                            (typeOfMoney === id ? (total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && Number(total[id].result) + Number(amount) || 0 + Number(amount)),0)} </span>
                                                                : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>)
                                                            : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>
                                                        : (total[id] && total[id].result || 0) < 0 ? <span className="font-red"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney((total[id] && total[id].result || 0),0)} </span>
                                                    }
                                                </td>
                                            )
                                        })
                                    }
                                </tr>
                            )
                        })}
                        <tr>
                            <td> Total</td>
                            {rows}
                        </tr>
                        </tbody>
                    </table>
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