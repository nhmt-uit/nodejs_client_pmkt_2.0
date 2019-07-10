import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

import { TransComponent } from 'my-components'
import { FormMemberContainer } from 'my-containers/member'
import { toggleModalMember } from 'my-actions/member/MemberAction'

class ModalFormMemberContainer extends Component {
    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalMember()
        }
    }

    render() {
        const modalTitle = (this.props.formType === "create") ? <TransComponent i18nKey="Create member" /> : <TransComponent i18nKey="Update member" />
        return (
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalMember()}>
                <ModalHeader toggle={_ => this.props.toggleModalMember()}>{modalTitle}</ModalHeader>
                <ModalBody>
                    <FormMemberContainer {...this.props} />
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}


const mapStateToProps = state => {
    return {
        isOpenModal: state.member.isOpenModal,
        formSaveStatus: state.member.formSaveStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalMember:  _ => dispatch(toggleModalMember()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormMemberContainer);