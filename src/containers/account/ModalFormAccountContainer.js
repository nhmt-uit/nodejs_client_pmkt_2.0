import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'my-styles/reactstrap-modal.css'
import FormAccountContainer from './FormAccountContainer'

class ModalFormAccountContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "update") this.modalTitle = this.props.t("Update account")
    }

    render() {
        const { t, isOpen, toggle, account } = this.props
        
        return (
            <Modal isOpen={isOpen} toggle={toggle} scrollable={true}>
                <ModalHeader toggle={toggle}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormAccountContainer account={account} />
                </ModalBody>
            </Modal>
        )
    }
}

export default withTranslation()(ModalFormAccountContainer)