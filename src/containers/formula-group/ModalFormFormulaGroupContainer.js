import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

import { TransComponent } from 'my-components'
import { FormFormulaGroupContainer } from 'my-containers/formula-group'
import { toggleModalFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction'

class ModalFormFormulaGroupContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "create") this.modalTitle = <TransComponent i18nKey="create formula group" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="update formula group" />
    }

    componentDidUpdate(){
        // Hide modal after save success
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalFormulaGroup()} scrollable={true} >
                <ModalHeader toggle={_ => this.props.toggleModalFormulaGroup()}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormFormulaGroupContainer {...this.props} />
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}


const mapStateToProps = state => {
    return {
        isOpenModal: state.FormulaGroupReducer.isOpenModal,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalFormulaGroup:  _ => dispatch(toggleModalFormulaGroup()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormFormulaGroupContainer);