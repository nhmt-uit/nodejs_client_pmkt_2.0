import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {get as _get, isEmpty} from 'lodash'
import {reduxForm} from "redux-form";

import {withTranslation} from "react-i18next";
import {TransComponent} from 'my-components'

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
        this.props.delTransaction(delValueID)
            .then( () => {
                this.setState({
                    isOpenDelModal: !this.state.isOpenDelModal
                })
            })
            .then( () => {
                this.props.getAllTransaction()
            })
            .catch(function (err) {
                console.log(err)
            })
    };

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

    toggleEditTransactionModal = (item) => {
        this.setState({
            editValue : item,
        })
        this.props.handleParent(item);
    }

    render() {
        const { t } = this.props;

        const {currencies, listTransaction} = this.props
        if (isEmpty(currencies) || isEmpty(listTransaction)) {
            return null;
        }
        var showCurrencies = currencies.map(function (item, index) {
            return(
                <th key={index} className="caption-subject font-red text-center"> {item.name} </th>
            )
        })

        return (
            <div className="table-responsive">
                <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                    <thead>
                    <tr role="row">
                        <th className="caption-subject font-red text-center"> # </th>
                        <th className="caption-subject font-red text-center"> <TransComponent i18nKey="Member"/> </th>
                        {showCurrencies}
                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Transaction"/></th>
                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Note"/></th>
                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Created"/></th>
                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Edit"/></th>
                        <th className="caption-subject font-red text-center"><TransComponent i18nKey="Delete"/></th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        listTransaction.map( (item, index) => {
                            var showCurrenciesValues = currencies.map(function (obj, index) {
                                if(obj.id === item.dv_tien_te_id){
                                    return(
                                        <td key={index} className="text-right"> {Helpers.formatMoney(item.result ,0)} </td>
                                    )
                                }
                                return(
                                    <td key={index} className="text-right"> {Helpers.formatMoney(0,0)} </td>
                                )
                            })

                            return(
                                <tr key={index}>
                                    <td className="text-center"> {index + 1} </td>
                                    <td className="text-center uppercase"> {item.customer_name} </td>
                                    {showCurrenciesValues}
                                    <td className="text-center font-dark"> {item.transaction_type} </td>
                                    <td className="text-center"> {item.note} </td>
                                    <td className="text-center"> {item.created} </td>
                                    <td className="text-center"> <button className="text-success btn btn-link"
                                                                         onClick={ () => this.toggleEditTransactionModal(item)}> <i className="fa fa-edit"></i> </button> </td>
                                    <td className="text-center"> <button className="text-success btn btn-link font-red"
                                                                         onClick={ () => this.toggleDelTransactionModal(item.id)}> <i className="fa fa-close"></i> </button> </td>
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
                                <TransComponent i18nKey="xac nhan"/>
                            </strong>
                        </ModalHeader>
                        <ModalBody>
                            <TransComponent i18nKey="Are you sure want to delete ?"/>
                        </ModalBody>
                        <ModalFooter>
                            <Button className="bg-red font-white" onClick={this.handleDelTransaction}><TransComponent i18nKey="Yes"/></Button>
                            <Button color="secondary" onClick={() => this.toggleDelTransactionModal()}><TransComponent i18nKey="Cancel"/></Button>
                        </ModalFooter>
                    </Modal>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.listTransaction.values'),
        currencies: state.TransactionReducer.currencies,
        listTransaction: state.TransactionReducer.listTransaction,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        getAllTransaction: params => {dispatch(getAllTransaction(params))},
        delTransaction: params => dispatch(delTransaction(params)),
    }
};

export default compose(
    reduxForm({form: 'listTransaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ListOfTransaction);