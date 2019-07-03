import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get as _get } from 'lodash'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'my-styles/reactstrap-modal.css'

import FormAccountContainer from './FormAccountContainer'
import { toggleModalAccount} from 'my-actions/AccountAction'
import { TransComponent } from 'my-components'

class ModalFormAccountContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "create") this.modalTitle = <TransComponent i18nKey="Create account" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update account" />
    }

    
    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalAccount()
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalAccount()} scrollable={true}>
                <ModalHeader toggle={_ => this.props.toggleModalAccount()}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormAccountContainer formType={this.props.formType} />
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
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalAccount:  _ => dispatch(toggleModalAccount()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormAccountContainer);
