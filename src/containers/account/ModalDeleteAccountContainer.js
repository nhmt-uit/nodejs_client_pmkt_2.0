import React, { Component } from 'react';

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { AccountService } from 'my-services/account'
import { TransComponent } from 'my-components'

class ModalDeleteAccountContainer extends Component {
    handleDelete = async _ => {
        await AccountService.deleteAccount(this.props.account.id)
        if (this.props.callback) this.props.callback(this.props.account)
        this.props.toggle()
    }

    render() {
        const { isOpen, toggle, account } = this.props
        
        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}><TransComponent i18nKey="Confirm" /></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey="confirm delete {{item}}" i18nObj={{item: account ? account.acc_name : null }} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="Confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={toggle}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

export default ModalDeleteAccountContainer