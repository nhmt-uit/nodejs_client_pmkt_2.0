import React, { Component } from 'react';
import { connect } from 'react-redux'
import {get as _get, isEqual as _isEqual} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaService } from 'my-services/formula'
import { toggleModalDeleteFormula, socketGetReport } from 'my-actions/AccountantAction'
import { Helpers} from 'my-utils'
import { TransComponent } from 'my-components'

class ModalFormFormulaContainer extends Component {
    handleDelete = async _ => {
        const { payloadDeleteFormula } = this.props
        const bankerAccountId = payloadDeleteFormula.bankerAccountId
        const scanData = payloadDeleteFormula.scanData
        const ctt_id = payloadDeleteFormula.formulaDetail.ctt_id

        await FormulaService.deleteLinkFormulaDetail(ctt_id)
        this.props.socketGetReport({id: bankerAccountId, scanData: scanData})
        this.props.toggleModalDeleteFormula()
    }

    render() {
        const { isOpenModalDeleteFormula, payloadDeleteFormula } = this.props
        const formulaID = _get(payloadDeleteFormula, 'formulaDetail.ctt_id')
        const formulaName = Helpers.formatFormulaName(_get(payloadDeleteFormula, 'formulaDetail.formulaName', ''))
        const formulaMember = _get(payloadDeleteFormula, 'formulaDetail.memberName', '').toUpperCase()
        
        return (
            <Modal isOpen={isOpenModalDeleteFormula} toggle={this.props.toggleModalDeleteFormula}>
                <ModalHeader toggle={this.props.toggleModalDeleteFormula}><TransComponent i18nKey="confirm" /></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey="are you sure unlink formula {{formulaname}} and member {{membername}}" i18nObj={{formulaname: formulaName, membername: formulaMember}} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={this.props.toggleModalDeleteFormula}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalDeleteFormula : state.AccountantReducer.isOpenModalDeleteFormula,
        payloadDeleteFormula : state.AccountantReducer.payloadDeleteFormula,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteFormula: (params) => {dispatch(toggleModalDeleteFormula( params))},
        socketGetReport: (params) => {dispatch(socketGetReport( params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalFormFormulaContainer);