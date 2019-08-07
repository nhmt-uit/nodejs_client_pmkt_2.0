import React, {Component} from 'react';
import {Button, Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import { connect } from 'react-redux';

import { TransComponent } from 'my-components';
import { toggleModal, getSubActive, getSubLocked } from 'my-actions/sub-status/SubStatusAction';
import { SubStatusService } from 'my-services/sub-status';

class ActionModalContainer extends Component {
    state = { isLoading: false };

    handleSave = () => {
        const account = this.props.selectedItem;
        const formData = {};

        let item = {};

        if (account.rootId) {
            formData.id = account.rootId;
            formData.itemId = account.id;

            item = account.parent;
        } else {
            formData.id = account.id;

            item = account;
        }

        this.setState({ isLoading: true }, async () => {
            if (account.isActive) {
                if (account.rootId) await SubStatusService.lockSub(formData);
                else await SubStatusService.lockSubByUser(formData);
            } else {
                if (account.rootId) await SubStatusService.unlockSub(formData);
                else await SubStatusService.unlockSubByUser(formData);
            }

            this.setState({ isLoading: false }, async () => {
                this.props.toggleModal();

                await this.props.getSubActive(item);
                await this.props.getSubLocked(item);
            });
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
                    <Button className="green" onClick={this.props.toggleModal}><TransComponent i18nKey="Close" /></Button>
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
        getSubActive: formData => dispatch(getSubActive(formData)),
        getSubLocked: formData => dispatch(getSubLocked(formData)),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ActionModalContainer);