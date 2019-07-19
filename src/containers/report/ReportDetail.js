import React, {Component} from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {reduxForm} from "redux-form";

import {withTranslation} from "react-i18next";
import {TransComponent, LoadingComponent} from 'my-components'

import { getReportDetail} from "my-actions/report/ReportDetailAction";
import {isEmpty, keyBy, sortBy} from "lodash";

import { Helpers } from 'my-utils'
import { AuthService } from 'my-services/systems'

class ReportDetail extends Component {
    componentWillMount() {
        var chuky_id = window.location.pathname.split('/')[4];
        this.props.getReportDetail(chuky_id)
    }

    render() {
        const { t } = this.props;
        const username = AuthService.getUsername();
        var DATA = this.props.reportDetail.payload;
        if(isEmpty(DATA)){
            return (
                <div><LoadingComponent /></div>
            );
        }
        var List = DATA.res.data;
        List = Object.entries(List);
        //Sort Member by username
        List = sortBy(List, [function(o) { return o[1].name;}]);
        //Khai bao mang chua tbody
        var arr = [];
        var DV_Tiente = DATA.res.currencyMap;
        var DV_Tiente_Map = keyBy(DV_Tiente, 'dv_tien_te_id')

        var cycle_name = window.location.pathname.split('/')[5];
        var cycleName = cycle_name.split('@').join('/')

        List.forEach(function (items, index) {
            index = index + 1;
            var banker_name = ''
            var member_name = items[1].name;
            var book_type = "ALL";
            var account = "";
            var level = 0;
            var item = items;
            if(items[1].child.accounting) { //Loc chi lay accounting
                do {
                    item = Object.entries(item);
                    var VND = 0, USD = 0;
                    var Money;

                    if (level === 0) {
                        book_type = "ALL";
                        account = "";

                        Money = item[1][1].total;
                        Money = Object.entries(Money);
                        Money.forEach(function (item) {
                            var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                            if (typeOfMoney == 'VND') {
                                VND = item[1].result
                            }
                            if (typeOfMoney == 'USD') {
                                USD = item[1].result
                            }

                        })

                        arr.push({
                            index: index,
                            member_name: member_name,
                            book_type: book_type,
                            banker_name: '',
                            account: '',
                            VND: VND,
                            USD: USD,
                        })
                        item = item[1][1].child;
                    } else if (level === 1) {
                        item = item[0][1].child;
                    } else {
                        item.forEach(function (item) {
                            USD = 0;
                            VND = 0
                            book_type = item[1].name;
                            var Money = item[1].total;
                            Money = Object.entries(Money);
                            Money.forEach(function (item) {
                                var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                                if (typeOfMoney == 'VND') {
                                    VND = item[1].result
                                }
                                if (typeOfMoney == 'USD') {
                                    USD = item[1].result
                                }
                            });
                            arr.push({
                                index: index,
                                member_name: member_name,
                                book_type: book_type,
                                banker_name: '',
                                account: '',
                                VND: VND,
                                USD: USD,
                            });
                            var child = item[1].child;
                            child = Object.entries(child);
                            child.forEach(function (item) {
                                USD = 0;
                                VND = 0
                                banker_name = item[1].banker_name
                                account = item[1].name;
                                Money = item[1].total;
                                Money = Object.entries(Money);
                                Money.forEach(function (item) {
                                    var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                                    if (typeOfMoney == 'VND') {
                                        VND = item[1].result
                                    }
                                    if (typeOfMoney == 'USD') {
                                        USD = item[1].result
                                    }
                                })
                                arr.push({
                                    index: index,
                                    member_name: member_name,
                                    book_type: book_type,
                                    banker_name: banker_name,
                                    account: account,
                                    VND: VND,
                                    USD: USD,
                                })
                            })

                        })
                        item = item[0][1].child;
                    }
                    level++;
                } while (level < 3)
            }
        })
        return(
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                    <thead>
                        <tr role="row">
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="cycle"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"> # </th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="id pmkt"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="Member"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="Type"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="Company"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="Account"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="vnd"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="usd"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="rm"/></th>
                            <th className="caption-subject font-red text-center bold uppercase"><TransComponent i18nKey="thb"/></th>
                        </tr>
                    </thead>
                    <tbody>
                    {
                        // rows
                        arr.length ?
                        arr.map(function (item, index) {
                            return <tr key={index}>
                                <td className="text-center"> {cycleName} </td>
                                <td className="text-center"> {item.index} </td>
                                <td className="text-center font-dark uppercase"> {username} </td>
                                <td className="text-center font-dark uppercase"> {item.member_name} </td>
                                <td className="text-center font-dark uppercase"> { item.book_type === "ALL" ? <span className="font-red bold uppercase"> {item.book_type} </span> : <span> {item.book_type} </span> } </td>
                                <td className="text-center font-dark uppercase"> {item.banker_name} </td>
                                <td className="text-center font-dark uppercase"> {item.account} </td>
                                <td className="text-right"> {
                                    item.VND < 0 ? <span className="font-red"> {Helpers.formatMoney(item.VND,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(item.VND,0)} </span>
                                }
                                </td>

                                <td className="text-right"> {
                                    item.USD < 0 ? <span className="font-red"> {Helpers.formatMoney(item.USD,0)} </span> : <span className="font-blue-steel"> {Helpers.formatMoney(item.USD,0)} </span>
                                } </td>

                                <td className="text-right"> 0 </td>
                                <td className="text-right"> 0 </td>
                            </tr>
                        })
                            : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                    }
                    </tbody>
                </table>
            </div>
        )
    }
}

const mapStateToProps = state => {

    return {
        auth: state.AuthReducer,
        reportDetail: state.report_detail,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getReportDetail: params => {dispatch(getReportDetail(params))}
    }
};

export default compose(
    reduxForm({form: 'report_detail'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ReportDetail);