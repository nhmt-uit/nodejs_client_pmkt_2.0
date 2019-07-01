import React, {Component} from 'react'
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

import {isEmpty, keyBy} from 'lodash'
import {getDetailReport} from "my-actions/report/TransactionAction";

class BillTransaction extends Component {
    constructor(props) {
        super(props)
        this.state = {
            memberId: this.props.memberId,
            cycleId: this.props.cycleId,
        }
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.memberId != this.props.memberId || nextProps.cycleId != this.props.cycleId) {
            console.log("Nhan props moi khac props cu, goi api lay du lieu:  ", nextProps.cycleId)
            var post = {
                memberId: nextProps.memberId,
                cycleId: nextProps.cycleId,
            }
            this.props.getDetailReport(post)
        }
    }

    render() {
        var DATA = this.props.transaction.reportDetail;
        if (isEmpty(DATA)) {
            return null;
        }
        if (DATA.status == false) {
            return null;
        }
        var currencyMap = DATA.res.currencyMap;
        var result = DATA.res.result;
        result = Object.entries(result);
        var total = DATA.res.total;
        console.log("total 1", total)
        let map_currency = keyBy(currencyMap, 'dv_tien_te_id');

        let currencyIDs = currencyMap.map(function (currency) {
            return currency.dv_tien_te_id;
        }).sort().reverse()


        let headers = currencyIDs.map(function (id) {
            return (
                <th key={id} className="caption-subject font-red text-center"> {map_currency[id].dv_tien_te} </th>
            )
        })

        let rows = currencyIDs.map(function (id) {
            return (
                <td key={id} className="caption-subject font-green text-center"> {total[id].result} </td>
            )
        })

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
                        {result.map(function (item, index) {
                            var total = item[1].total;
                            console.log("TOTAL", total)

                            return (
                                <tr key={index}>
                                    <td> {item[1].name}</td>
                                    {
                                        currencyIDs.map(function (id) {
                                            return (
                                                <td key={id}
                                                    className="caption-subject font-green text-center"> {total[id] && total[id].result || 0} </td>
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
    let initialValues = {};
    if (state.form.transaction) {
        initialValues = state.form.transaction.values;
    }
    return {initialValues, auth: state.AuthReducer, transaction: state.transaction}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getDetailReport: params => {
            dispatch(getDetailReport(params))
        },
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(BillTransaction);