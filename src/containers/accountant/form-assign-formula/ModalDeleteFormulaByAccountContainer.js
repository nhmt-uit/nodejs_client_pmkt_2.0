import React, { Component } from 'react';
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaService } from 'my-services/formula'
import { TransComponent } from 'my-components'
import { toggleModalDeleteFormulaByAccount, initFormulaByAccount } from 'my-actions/AccountantAssignFormulaAction'

class ModalDeleteFormulaByAccountContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(newProps.isOpenModalDeleteFormulaByAccount !== this.props.isOpenModalDeleteFormulaByAccount)
            return true
        return false;
    }


    handleDelete = async _ => {
        if (this.props.paramsDeleteFormulaByAccount.type === "single") {
            const { congthuctinhId, account_id } = this.props.paramsDeleteFormulaByAccount
            await FormulaService.deleteFormulaByAccount(congthuctinhId, account_id)
            this.props.toggleModalDeleteFormulaByAccount()
            this.props.initFormulaByAccount(account_id)
        } else if (this.props.paramsDeleteFormulaByAccount.type === "multiple") {
            const { congthuctinhIds, account_id } = this.props.paramsDeleteFormulaByAccount
            await FormulaService.deleteMultipleFormulaByAccount(congthuctinhIds)
            this.props.toggleModalDeleteFormulaByAccount()
            this.props.initFormulaByAccount(account_id)
        }
    }

    render() {
        let message = null
        const deleteType = _get(this.props, 'paramsDeleteFormulaByAccount.type')
        if (deleteType && this.props.paramsDeleteFormulaByAccount.type === "single") {
            message = <TransComponent i18nKey="Do you want remove this formula ?" />
        }  else if (deleteType && this.props.paramsDeleteFormulaByAccount.type === "multiple") {
            message = <TransComponent i18nKey="Do you want remove all checked?" />
        }

        return (
            <Modal isOpen={this.props.isOpenModalDeleteFormulaByAccount} toggle={_ => this.props.toggleModalDeleteFormulaByAccount()}>
                <ModalHeader toggle={_ => this.props.toggleModalDeleteFormulaByAccount()}><TransComponent i18nKey="confirm" /></ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteFormulaByAccount()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalDeleteFormulaByAccount : state.AccountantAssignFormulaReducer.isOpenModalDeleteFormulaByAccount,
        paramsDeleteFormulaByAccount : state.AccountantAssignFormulaReducer.paramsDeleteFormulaByAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteFormulaByAccount: (params) => {dispatch(toggleModalDeleteFormulaByAccount(params))},
        initFormulaByAccount: accountId => dispatch(initFormulaByAccount(accountId)),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeleteFormulaByAccountContainer);