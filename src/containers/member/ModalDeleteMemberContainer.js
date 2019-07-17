import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { TransComponent, LoadingComponent } from 'my-components'
import { toggleModalDeleteMember, deleteMember } from 'my-actions/member/MemberAction'

class ModalDeleteMemberContainer extends Component {
    componentDidUpdate(){
        // Hide modal after delete success
        if(this.props.formDeleteStatus && this.props.isOpenModalDelete) {
            this.props.toggleModalDeleteMember()
        }
    }

    render() {
        let username = _get(this.props, 'selectedItem.username')
        username = username ? username.toUpperCase() : username
        return (
            <Modal isOpen={this.props.isOpenModalDelete} toggle={_ => this.props.toggleModalDeleteMember()}>
                { this.props.isInitDeleteMember ? <LoadingComponent /> : null }
                <ModalHeader toggle={_ => this.props.toggleModalDeleteMember()}><TransComponent i18nKey="Confirm" /></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey="confirm delete {{item}}" i18nObj={{item: username}} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={_ => this.props.deleteMember({id: _get(this.props, 'selectedItem.id')})}><TransComponent i18nKey="Confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteMember()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}



const mapStateToProps = state => {
    return {
        //Handle Loading
        isInitDeleteMember: state.MemberReducer.isInitDeleteMember,

        isOpenModalDelete: state.MemberReducer.isOpenModalDelete,
        formDeleteStatus: state.MemberReducer.formDeleteStatus,
        selectedItem : state.MemberReducer.selectedItem,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteMember: _ => dispatch(toggleModalDeleteMember()),
        deleteMember: params => dispatch(deleteMember(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalDeleteMemberContainer);
