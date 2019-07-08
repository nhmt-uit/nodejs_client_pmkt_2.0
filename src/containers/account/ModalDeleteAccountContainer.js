import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { TransComponent } from 'my-components'
import { toggleModalDeleteAccount, deleteAccount } from 'my-actions/AccountAction'

class ModalDeleteAccountContainer extends Component {
    componentDidUpdate(){
        // Hide modal after delete success
        
        if(this.props.formDeleteStatus && this.props.isOpenModalDelete) {
            this.props.toggleModalDeleteAccount()
        }
    }

    render() {
        return (
            <Modal isOpen={this.props.isOpenModalDelete} toggle={_ => this.props.toggleModalDeleteAccount()}>
                <ModalHeader toggle={_ => this.props.toggleModalDeleteAccount()}><TransComponent i18nKey="Confirm" /></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey="confirm delete {{item}}" i18nObj={{item: _get(this.props, 'selectedItem.acc_name')}} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={_ => this.props.deleteAccount({id: _get(this.props, 'selectedItem.id')})}><TransComponent i18nKey="Confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteAccount()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}



const mapStateToProps = state => {
    return {
        isOpenModalDelete: state.AccountReducer.isOpenModalDelete,
        formDeleteStatus: state.AccountReducer.formDeleteStatus,
        selectedItem : state.AccountReducer.selectedItem,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteAccount: _ => dispatch(toggleModalDeleteAccount()),
        deleteAccount: params => dispatch(deleteAccount(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalDeleteAccountContainer);
