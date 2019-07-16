import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'my-styles/reactstrap-modal.css'

import FormAccountContainer from './FormAccountContainer'
import { toggleModalAccount} from 'my-actions/AccountAction'
import { TransComponent } from 'my-components'

class ModalFormAccountContainer extends Component {
    componentDidUpdate() {
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalAccount()
        }
    }

    render() {
        const modalTitle = this.props.formType === "create" ? <TransComponent i18nKey="Create account" /> : <TransComponent i18nKey="Update account" />;

        return (
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalAccount()} scrollable={true}>
                <ModalHeader toggle={_ => this.props.toggleModalAccount()}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <FormAccountContainer {...this.props} />
                </ModalBody>
                <ModalFooter>
                    {/* <Button color="btn btn-default green" onClick={this.handleSaveFormData}><TransComponent i18nKey="Save" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalAccount()}><TransComponent i18nKey="Cancel" /></Button> */}
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        isOpenModal: state.AccountReducer.isOpenModal,
        formSaveStatus: state.AccountReducer.formSaveStatus,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalAccount:  _ => dispatch(toggleModalAccount()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormAccountContainer);
