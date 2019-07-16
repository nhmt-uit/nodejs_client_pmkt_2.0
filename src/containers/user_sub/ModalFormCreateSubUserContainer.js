import React, {Component} from "react";
import { TransComponent } from 'my-components'
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {compose} from "redux";
import {connect} from "react-redux";

import {getMemberSub, toggleModalMemberSub} from 'my-actions/account_sub/AccountSubAction'
import FormSubUserContainer from "./FormSubUserContainer";


class ModalFormCreateSubUserContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            formType: 'create'
        }
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModal) {
            this.props.toggleModalMemberSub()
        }
    }

    render() {
        return(
            <Modal isOpen={this.props.isOpenModal} toggle={_ => this.props.toggleModalMemberSub()}>
                <ModalHeader toggle={_ => this.props.toggleModalMemberSub()}><TransComponent i18nKey="create sub"/></ModalHeader>
                <ModalBody>
                    <FormSubUserContainer {...this.state} />
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
        getMemberSub: params => {dispatch(getMemberSub(params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormCreateSubUserContainer);