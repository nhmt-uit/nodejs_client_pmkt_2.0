import React, { Component } from 'react';
import { withTranslation } from 'react-i18next'
import { compose } from 'redux'
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaService } from 'my-services/formula'
import { toggleModalDeleteFormula, socketGetReport } from 'my-actions/AccountantAction'
import { Helpers} from 'my-utils'

class ModalDeleteFormulaContainer extends Component {
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
        const { t, isOpenModalDeleteFormula, payloadDeleteFormula } = this.props
        const formulaID = _get(payloadDeleteFormula, 'formulaDetail.ctt_id')
        const formulaName = Helpers.formatFormulaName(_get(payloadDeleteFormula, 'formulaDetail.formulaName', ''))
        const formulaMember = _get(payloadDeleteFormula, 'formulaDetail.memberName', '').toUpperCase()
        
        return (
            <Modal isOpen={isOpenModalDeleteFormula} toggle={this.props.toggleModalDeleteFormula}>
                <ModalHeader toggle={this.props.toggleModalDeleteFormula}>{t("confirm")}</ModalHeader>
                <ModalBody>
                    {t("are you sure unlink formula {{formulaname}} and member {{membername}}", {formulaname: formulaName, membername: formulaMember})}
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}>{t("confirm")}</Button>{' '}
                    <Button color="btn btn-default red" onClick={this.props.toggleModalDeleteFormula}>{t("Cancel")}</Button>
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

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ModalDeleteFormulaContainer);