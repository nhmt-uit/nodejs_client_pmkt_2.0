import React, {Component} from 'react';
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import { getReportDetail} from "my-actions/report/ReportDetailAction";
import {isEmpty, keyBy} from "lodash";

import { Helpers } from 'my-utils'
import { AuthService } from 'my-services/systems'

class ReportDetail extends Component {
    componentWillMount() {
        var chuky_id = window.location.pathname.split('/')[4];
        // console.log(window.location.pathname);
        this.props.getReportDetail(chuky_id)
    }

    render() {
        const { t } = this.props;
        const username = AuthService.getUsername();
        var DATA = this.props.reportDetail.payload;
        if(isEmpty(DATA)){
            return null;
        }
        var List = DATA.res.data;
        List = Object.entries(List);
        //Khai bao mang chua tbody
        var arr = [];
        var DV_Tiente = DATA.res.currencyMap;
        var DV_Tiente_Map = keyBy(DV_Tiente, 'dv_tien_te_id')


        List.forEach(function (items, index) {
            index = index + 1;
            var member_name = items[1].name;
            var book_type = "ALL";
            var account = "";
            var level = 0;
            var item = items;
            do{
                item = Object.entries(item);
                var VND = 0, USD = 0;
                var Money;

                if(level === 0){
                    book_type = "ALL";
                    account = "";

                    Money = item[1][1].total;
                    Money = Object.entries(Money);
                    Money.forEach(function(item) {
                        var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                        if(typeOfMoney == 'VND'){
                            VND = item[1].result
                        }
                        if(typeOfMoney == 'USD') {
                            USD = item[1].result
                        }

                    })

                    arr.push({
                        index: index,
                        member_name: member_name,
                        book_type: book_type,
                        account: '',
                        VND: VND,
                        USD: USD,
                    })
                    item = item[1][1].child;
                } else if(level === 1){
                    item = item[0][1].child;
                } else{
                    item.forEach(function (item) {
                        USD = 0; VND = 0
                        book_type = item[1].name;
                        var Money = item[1].total;
                        Money = Object.entries(Money);
                        Money.forEach(function (item) {
                            var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                            if(typeOfMoney == 'VND'){
                                VND = item[1].result
                            }
                            if(typeOfMoney == 'USD'){
                                USD = item[1].result
                            }});
                        arr.push({
                            index: index,
                            member_name: member_name,
                            book_type: book_type,
                            account: '',
                            VND: VND,
                            USD: USD,
                        });
                        var child = item[1].child;
                        child = Object.entries(child);
                        child.forEach(function (item) {
                            USD = 0; VND = 0
                            account = item[1].name;
                            Money = item[1].total;
                            Money = Object.entries(Money);
                            Money.forEach(function (item) {
                                var typeOfMoney = DV_Tiente_Map[item[1].id].dv_tien_te
                                if(typeOfMoney == 'VND'){
                                    VND = item[1].result
                                }
                                if(typeOfMoney == 'USD'){
                                    USD = item[1].result
                                }})
                            arr.push({
                                index: index,
                                member_name: member_name,
                                book_type: book_type,
                                account: account,
                                VND: VND,
                                USD: USD,
                            })
                        })

                    })
                    item = item[0][1].child;
                }
                level++;
            }while (level < 3)
        })
        return(
            <div>
                <div className="table-scrollable">
                    <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                        <thead>
                            <tr role="row">
                                <th className="caption-subject font-red text-center bold uppercase"> # </th>
                                <th className="caption-subject font-red text-center bold uppercase"> ID PMKT </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("Member")} </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("Type")} </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("Account")}</th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("VND")} </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("USD")} </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("RM")} </th>
                                <th className="caption-subject font-red text-center bold uppercase"> {t("THB")} </th>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            // rows
                            arr.map(function (item, index) {
                                return <tr key={index}>
                                    <td className="text-center"> {item.index} </td>
                                    <td className="text-center font-dark uppercase"> {username} </td>
                                    <td className="text-center font-dark uppercase"> {item.member_name} </td>
                                    <td className="text-center font-dark uppercase"> { item.book_type === "ALL" ? <span className="font-red bold uppercase"> {item.book_type} </span> : <span> {item.book_type} </span> } </td>
                                    <td className="text-center font-dark uppercase"> {item.account} </td>
                                    <td className="text-right"> {
                                        item.VND < 0 ? <span className="font-red"> {Helpers.formatMoney(item.VND,0)} </span> : <span className="font-green"> {Helpers.formatMoney(item.VND,0)} </span>
                                    }
                                    </td>

                                    <td className="text-right"> {
                                        item.USD < 0 ? <span className="font-red"> {Helpers.formatMoney(item.USD,0)} </span> : <span className="font-green"> {Helpers.formatMoney(item.USD,0)} </span>
                                    } </td>

                                    <td className="text-right"> 0 </td>
                                    <td className="text-right"> 0 </td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.report_detail){
        initialValues = state.form.report_detail.values;
    }
    return {initialValues, auth: state.AuthReducer, reportDetail: state.report_detail}
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