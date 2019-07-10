import React, {Component} from "react";
import { TransComponent } from 'my-components'
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {compose} from "redux";
import {connect} from "react-redux";

import { createMemberSub, getMemberSub, toggleModalMemberSub, getSuffixesMember} from 'my-actions/account_sub/AccountSubAction'
import FormSubUserContainer from "./FormSubUserContainer";


class ModalFormSubUserContainer extends Component{
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "create") this.modalTitle = <TransComponent i18nKey="Create member" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update sub" />
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalMemberSub()
        }
    }

    render() {
        console.log("PROPs", this.props)
        return(
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalMemberSub()}>
                <ModalHeader toggle={_ => this.props.toggleModalMemberSub()}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <FormSubUserContainer {...this.props} />
                </ModalBody>
                <ModalFooter />
            </Modal>
        )
    }
}

const mapStateToProps = state => {
    return {
        isOpenModal: state.AccountSubReducer.isOpenModal,
        formSaveStatus: state.AccountSubReducer.formSaveStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalMemberSub:  _ => dispatch(toggleModalMemberSub()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormSubUserContainer);