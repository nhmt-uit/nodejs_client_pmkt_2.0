import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { TransComponent } from 'my-components'
import { toggleModalDeleteMemberDetail, deleteMemberFormulaDetail } from 'my-actions/member/MemberAction'

class ModalDeleteMemberDetailContainer extends Component {
    componentDidUpdate(){
        // Hide modal after delete success
        if(this.props.formDeleteDetailStatus && this.props.isOpenModalDeleteDetail) {
            this.props.toggleModalDeleteMemberDetail()
        }
    }


    render() {
        const paramsDelete = {...this.props.selectedItemDetail, typeDelete: this.props.typeModal}
        return (
            <Modal isOpen={this.props.isOpenModalDeleteDetail} toggle={_ => this.props.toggleModalDeleteMemberDetail()}>
                <ModalHeader toggle={_ => this.props.toggleModalDeleteMemberDetail()}><TransComponent i18nKey="Confirm" /></ModalHeader>
                <ModalBody>
                    {
                        this.props.typeModal === "single" ?
                            <TransComponent i18nKey="Are you sure ?" />
                        :
                            <TransComponent i18nKey="Do you want remove all checked?" />
                    }
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={_ => this.props.deleteMemberFormulaDetail(paramsDelete)}><TransComponent i18nKey="Confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteMemberDetail()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}



const mapStateToProps = state => {
    return {
        typeModal: state.MemberReducer.typeModal,
        isOpenModalDeleteDetail: state.MemberReducer.isOpenModalDeleteDetail,
        formDeleteDetailStatus: state.MemberReducer.formDeleteDetailStatus,
        selectedItemDetail : state.MemberReducer.selectedItemDetail,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteMemberDetail: _ => dispatch(toggleModalDeleteMemberDetail()),
        deleteMemberFormulaDetail: params => dispatch(deleteMemberFormulaDetail(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalDeleteMemberDetailContainer);
