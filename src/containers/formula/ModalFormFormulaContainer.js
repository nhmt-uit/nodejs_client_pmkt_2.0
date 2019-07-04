import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

import { TransComponent } from 'my-components'
import { FormFormulaContainer } from 'my-containers/formula'
import { toggleModalFormula } from 'my-actions/formula/FormulaAction'

class ModalFormFormulaContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "create") this.modalTitle = <TransComponent i18nKey="Create formula" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update formula" />
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalFormula()
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalFormula()}>
                <ModalHeader toggle={_ => this.props.toggleModalFormula()}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormFormulaContainer {...this.props} />
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}


const mapStateToProps = state => {
    return {
        isOpenModal: state.FormulaReducer.isOpenModal,
        formSaveStatus: state.FormulaReducer.formSaveStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalFormula:  _ => dispatch(toggleModalFormula()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormFormulaContainer);