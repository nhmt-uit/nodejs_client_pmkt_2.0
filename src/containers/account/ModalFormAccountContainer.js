import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { get as _get } from 'lodash'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import 'my-styles/reactstrap-modal.css'

import FormAccountContainer from './FormAccountContainer'
import { saveAccount } from 'my-actions/AccountAction'
import { socketReloadBankerAccountInfo } from 'my-actions/AccountantAction'
import { TransComponent } from 'my-components'

class ModalFormAccountContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update account" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update account" />
    }

    /*
    |--------------------------------------------------------------------------
    | Save Form Account
    |--------------------------------------------------------------------------
    */
    handleSaveFormData = _ => {
        let payload = {
            id: '5a38a92120fd7e9eb4459107',
            acc_name: '67bk',
            belong_account: 'Is root account',
            company: '56850ba0097802b9f23929b4',
            is_active: 'true',
            note: '',
            sub_user: '67bksub99',
            sub_pass: 'qqq111@Q',
            sub_code: '123123',
            login_num: '',
        }
        // this.props.saveAccount(this.props.initialValues)
        this.props.saveAccount(payload)
        this.props.socketReloadBankerAccountInfo({id: "570ae9a506499fb0896fd4f2"})
        this.props.toggle()
    }

    render() {
        const { isOpen, toggle, account } = this.props
        
        return (
            <Modal isOpen={isOpen} toggle={toggle} scrollable={true}>
                <ModalHeader toggle={toggle}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormAccountContainer account={account} formType={this.props.formType} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleSaveFormData}><TransComponent i18nKey="Save" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={toggle}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_account.values', {}),
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        saveAccount: (payload) => {dispatch(saveAccount(payload))},
        socketReloadBankerAccountInfo: (payload) => {dispatch(socketReloadBankerAccountInfo(payload))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormAccountContainer);
