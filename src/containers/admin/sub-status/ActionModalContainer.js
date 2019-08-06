import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { connect } from 'react-redux';

import { TransComponent } from 'my-components';
import { toggleModal } from 'my-actions/sub-status/SubStatusAction';
import { SubStatusService } from 'my-services/sub-status';

class ActionModalContainer extends Component {
    state = { isLoading: false };

    handleSave = () => {
        const account = this.props.selectedItem;
        const formData = { id: account.id };

        if (account.rootId) {
            formData.id = account.rootId;
            formData.itemId = account.id;
        } else formData.id = account.id;

        this.setState({ isLoading: true }, async () => {
            if (this.props.isActive) {

            } else {
                await SubStatusService.unlockSub(formData);

                this.setState({ isLoading: false }, () => this.props.toggleModal())
            }
        })
    };

    render() {
        return (
            <Modal isOpen={this.props.isOpenModal} toggle={this.props.toggleModal}>
                <ModalHeader toggle={this.props.toggleModal}><strong><TransComponent i18nKey="Xac nhan" /></strong></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey="Are you sure ?" />
                </ModalBody>
                <ModalFooter>
                    <Button
                        className="red"
                        onClick={this.handleSave}
                        disabled={this.state.isLoading}
                    ><TransComponent i18nKey="Save" />{ this.state.isLoading ? <>&nbsp;<i className="fa fa-spin fa-spinner" /></> : null }</Button>&nbsp;
                    <Button className="green" onClick={() => this.props.toggleModal}><TransComponent i18nKey="Close" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModal: state.SubStatusReducer.isOpenModal || false,
        selectedItem: state.SubStatusReducer.selectedItem || {},
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModal: selectedItem => dispatch(toggleModal(selectedItem)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionModalContainer);