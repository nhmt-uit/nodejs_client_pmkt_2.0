import React, { Component } from 'react';
import { connect } from 'react-redux'
import {get as _get, isEqual as _isEqual} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaService } from 'my-services/formula'
import { toggleModalFormFormula, socketGetReport } from 'my-actions/AccountantAction'
import { Helpers} from 'my-utils'
import { TransComponent } from 'my-components'
import { FormAssignContainer, ListFormulaByAccountContainer } from 'my-containers/accountant'

class ModalFormFormulaContainer extends Component {
    handleToggleModal = _ => {
        const { payloadSelectedFormula } = this.props
        const bankerAccountId = payloadSelectedFormula.bankerAccountId
        const scanData = payloadSelectedFormula.scanData
        this.props.socketGetReport({id: bankerAccountId, scanData: scanData})
        this.props.toggleModalFormFormula()
    }

    render() {
        const { isOpenModalFormFormula, payloadSelectedFormula } = this.props
        const selectedAccount = {value: _get(payloadSelectedFormula, 'accInfo.id'), label: _get(payloadSelectedFormula, 'accInfo.acc_name'), bankerId: _get(payloadSelectedFormula, 'accInfo.banker') }
        const rootAccInfo =  _get(payloadSelectedFormula, 'rootAccInfo')
        return (
            <Modal isOpen={isOpenModalFormFormula} toggle={_ => this.handleToggleModal()} className="modal-lg modal-xxl">
                <ModalHeader toggle={_ => this.handleToggleModal()}><TransComponent i18nKey="confirm" /></ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-4">
                            <FormAssignContainer selectedAccount={selectedAccount} rootAccInfo={rootAccInfo} />
                        </div>
                        <div className="col-md-8">
                            <ListFormulaByAccountContainer />
                        </div>
                    </div>
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalFormFormula()}><TransComponent i18nKey="Cancel" /></Button> */}
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalFormFormula : state.AccountantReducer.isOpenModalFormFormula,
        payloadSelectedFormula : state.AccountantReducer.payloadSelectedFormula,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalFormFormula: (params) => {dispatch(toggleModalFormFormula( params))},
        socketGetReport: (params) => {dispatch(socketGetReport( params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalFormFormulaContainer);