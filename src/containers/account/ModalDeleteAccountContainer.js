import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { AccountService } from 'my-services/account'

class ModalDeleteAccountContainer extends Component {
    handleDeleteAccount = async _ => {
        console.log(this.props.account)
        await AccountService.deleteAccount(this.props.account.id)
        if (this.props.callback) this.props.callback(this.props.account)
        this.props.toggle()
    }

    render() {
        const { t, isOpen, toggle, account } = this.props
        
        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{t("confirm")}</ModalHeader>
                <ModalBody>
                    {t("confirm delete {{item}}", {item: account ? account.acc_name : null })}
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDeleteAccount}>{t("confirm")}</Button>{' '}
                    <Button color="btn btn-default red" onClick={toggle}>{t("Cancel")}</Button>
                </ModalFooter>
            </Modal>
        );
    }
}



const mapStateToProps = state => {
    
}

const mapDispatchToProps = (dispatch) => {

};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ModalDeleteAccountContainer);