import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {withTranslation} from "react-i18next";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {isEmpty} from 'lodash'

import { Helpers } from 'my-utils'
import { getAllTransaction} from "my-actions/report/TransactionAction";
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { delTransaction} from "my-actions/report/TransactionAction";


class ListOfTransaction extends Component {
    constructor(props) {
        super(props);
        this.state = {
            delValueID: '',
            editValue:'',
            isOpenDelModal: false,
        }
    }

    componentWillMount() {
        this.props.getAllTransaction()
    }

    handleDelTransaction = () => {
        var delValueID = {
            id: this.state.delValueID
        }
        var self = this;
        this.props.delTransaction(delValueID)
            .then(function () {
                self.setState({
                    isOpenDelModal: !self.state.isOpenDelModal
                })
            })
            .then(function () {
                self.props.getAllTransaction()
            })
            .catch(function (err) {
                console.log(err)
            })
    };

    toggleEditTransactionModal = (item) => {
        this.setState({
            editValue : item,
        })
        this.props.handleParent(item);
    }

    toggleDelTransactionModal = (value_id) => {
        if(value_id){
            this.setState({
                delValueID: value_id,
            })
        }
        var isOpenDelModal = this.state.isOpenDelModal;
        this.setState({
            isOpenDelModal : !isOpenDelModal,
        })
    };

    render() {
        const { t } = this.props;
        var DATA = this.props.allTransaction.payload;
        if(isEmpty(DATA)){
            return null;
        }
        var List = DATA.res.data.List.result;
        // console.log("LIST ALL TRANSACTION", List)
        var self = this;
        return (
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
                            return(
                                <tr key={index}>
                                    <td className="text-center"> {index + 1} </td>
                                    <td className="text-center uppercase"> {item.customer_name} </td>
                                    <td className="text-right"> {Helpers.formatMoney(VND,0)} </td>
                                    <td className="text-right"> {Helpers.formatMoney(USD,0)} </td>
                                    <td className="text-center font-dark"> {item.transaction_type} </td>
                                    <td className="text-center"> {item.note} </td>
                                    <td className="text-center"> {item.created} </td>
                                    <td className="text-center"> <button className="text-success btn btn-link"
                                                                         onClick={ () => self.toggleEditTransactionModal(item)}> <i className="fa fa-edit"></i> </button> </td>
                                    <td className="text-center"> <button className="text-success btn btn-link font-red"
                                                                         onClick={ () => self.toggleDelTransactionModal(item.id)}> <i className="fa fa-close"></i> </button> </td>
                                </tr>
                            )
                        })
                    }
                    </tbody>
                </table>
                <div>
                    <Modal isOpen={this.state.isOpenDelModal} toggle={() => this.toggleDelTransactionModal()}>
                        <ModalHeader toggle={() => this.toggleDelTransactionModal()} className="text-uppercase">
                            <strong>
                                {t('Confirm')}
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            {t('Are you sure ?')}
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-red font-white" onClick={this.handleDelTransaction}> {t('Yes')} </Button>
                            <Button color="secondary" onClick={() => this.toggleDelTransactionModal()}>{t('Cancel')}</Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.transaction){
        initialValues = state.form.transaction.values;
    }
    return {initialValues, auth: state.AuthReducer, allTransaction: state.transaction}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllTransaction: params => {dispatch(getAllTransaction(params))},
        delTransaction: params => dispatch(delTransaction(params)),
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ListOfTransaction);