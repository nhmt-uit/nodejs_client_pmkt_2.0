import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {withTranslation} from "react-i18next";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {isEmpty} from 'lodash'

import { getAllTransaction} from "my-actions/report/TransactionAction";

class ListOfTransaction extends Component {
    componentWillMount() {
        this.props.getAllTransaction()
    }
    render() {
        const { t } = this.props;
        var DATA = this.props.allTransaction.payload;
        if(isEmpty(DATA)){
            return null;
        }
        var List = DATA.res.data.List.result;
        console.log("LIST ALL TRANSACTION", List)
        return (
            <div>
                <div className="table-scrollable">
                    <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                        <thead>
                        <tr role="row">
                            <th className="caption-subject font-red text-center"> # </th>
                            <th className="caption-subject font-red text-center"> {t("Member")}</th>
                            <th className="caption-subject font-red text-center"> {t("VND")} </th>
                            <th className="caption-subject font-red text-center"> {t("USD")} </th>
                            <th className="caption-subject font-red text-center"> {t("Transaction")} </th>
                            <th className="caption-subject font-red text-center"> {t("Note")} </th>
                            <th className="caption-subject font-red text-center"> {t("Created")} </th>
                            <th className="caption-subject font-red text-center"> {t("Edit")} </th>
                            <th className="caption-subject font-red text-center"> {t("Delete")} </th>
                        </tr>
                        </thead>
                        <tbody>
                        {
                            List.map(function (item, index) {
                                var VND = 0, USD = 0;
                                if(item.dv_tien_te === 'VND'){
                                    VND = item.result;
                                    USD = 0;
                                } else {
                                    VND = 0;
                                    USD = item.result;
                                }

                                return <tr key={index}>
                                    <td className="text-center"> {index + 1} </td>
                                    <td className="text-center uppercase"> {item.customer_name} </td>
                                    <td className="text-right"> {addCommas(VND)} </td>
                                    <td className="text-right"> {addCommas(USD)} </td>
                                    <td className="text-center font-dark"> {item.transaction_type} </td>
                                    <td className="text-center"> {item.note} </td>
                                    <td className="text-center"> {item.created} </td>
                                    <td className="text-center"> <button className="text-success btn btn-link" type="submit"> <i className="fa fa-edit"></i> </button> </td>
                                    <td className="text-center"> <button className="text-success btn btn-link font-red" type="submit"> <i className="fa fa-close"></i> </button> </td>
                                </tr>
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}

function addCommas(nStr) {
    nStr += '';
    var x = nStr.split('.');
    var x1 = x[0];
    var x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
        x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
}

const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.all_transaction){
        initialValues = state.form.all_transaction.values;
    }
    return {initialValues, auth: state.AuthReducer, allTransaction: state.all_transaction}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllTransaction: params => {dispatch(getAllTransaction(params))}
    }
};

export default compose(
    reduxForm({form: 'all_transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ListOfTransaction);