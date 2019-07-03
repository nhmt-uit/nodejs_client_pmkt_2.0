import React, { Component } from 'react';
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaService } from 'my-services/formula'
import { toggleModalDeleteFormula, socketGetReport } from 'my-actions/AccountantAction'
import { Helpers} from 'my-utils'
import { TransComponent } from 'my-components'

class ModalDeleteFormulaContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(newProps.isOpenModalDeleteFormula !== this.props.isOpenModalDeleteFormula)
            return true
        return false;
    }


    handleDelete = async _ => {
        const { payloadSelectedFormula } = this.props
        const bankerAccountId = payloadSelectedFormula.bankerAccountId
        const scanData = payloadSelectedFormula.scanData
        const ctt_id = payloadSelectedFormula.formulaDetail.ctt_id

        await FormulaService.deleteLinkFormulaDetail(ctt_id)
        this.props.socketGetReport({id: bankerAccountId, scanData: scanData})
        this.props.toggleModalDeleteFormula()
    }

    render() {
        const { payloadSelectedFormula } = this.props
        const formulaID = _get(payloadSelectedFormula, 'formulaDetail.ctt_id')
        const formulaName = Helpers.formatFormulaName(_get(payloadSelectedFormula, 'formulaDetail.formulaName', ''))
        const formulaMember = _get(payloadSelectedFormula, 'formulaDetail.memberName', '').toUpperCase()
        
        return (
            <Modal isOpen={this.props.isOpenModalDeleteFormula} toggle={_ => this.props.toggleModalDeleteFormula()}>
                <ModalHeader toggle={_ => this.props.toggleModalDeleteFormula()}><TransComponent i18nKey="confirm" /></ModalHeader>
                <ModalBody>
                <TransComponent i18nKey="are you sure unlink formula {{formulaname}} and member {{membername}}" i18nObj={{formulaname: formulaName, membername: formulaMember}} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteFormula()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalDeleteFormula : state.AccountantReducer.isOpenModalDeleteFormula,
        payloadSelectedFormula : state.AccountantReducer.payloadSelectedFormula,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteFormula: (params) => {dispatch(toggleModalDeleteFormula( params))},
        socketGetReport: (params) => {dispatch(socketGetReport( params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeleteFormulaContainer);