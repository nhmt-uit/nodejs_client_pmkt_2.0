import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {TransComponent} from 'my-components'

import { getMemberSub, resetFormSaveResponse, toggleModalEditMemberSub } from 'my-actions/account_sub/AccountSubAction'
import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import FormSubUserContainer from "./FormSubUserContainer";

class ModalFormEditSubUserContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            formType: 'update',
            item: {},
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenEditModal) {
            this.props.toggleModalEditMemberSub()
        }
    }

    callEditMemberSub = (item) => {
        this.props.toggleModalEditMemberSub();
        this.setState({
            item: item
        })
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpenEditModal} toggle={_ => this.props.toggleModalEditMemberSub()}>
                <ModalHeader toggle={_ => this.props.toggleModalEditMemberSub()}><TransComponent i18nKey="update sub"/></ModalHeader>
                <ModalBody>
                    <FormSubUserContainer {...this.state} />
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenEditModal: state.AccountSubReducer.isOpenEditModal,
        formSaveStatus: state.AccountSubReducer.formSaveStatus,
        formSaveResponse: state.AccountSubReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        getMemberSub: params => {dispatch(getMemberSub(params))},
        toggleModalEditMemberSub:  _ => dispatch(toggleModalEditMemberSub()),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormEditSubUserContainer);