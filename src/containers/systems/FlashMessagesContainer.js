import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { getLatestMessage } from 'redux-flash'
import { isEmpty as _isEmpty } from 'lodash'


import { TransComponent } from 'my-components'

class FlashMessagesContainer extends Component {
    state = {isOpen: null}

    handleHideModal = _ => {
        this.setState({isOpen: false})
    }

    render() {
        const isOpen = this.state.isOpen === null ? !_isEmpty(this.props.flash) ? true : this.state.isOpen : this.state.isOpen
        const flashMesage = !_isEmpty(this.props.flash) ? this.props.flash.message : null
        return (
            <Modal isOpen={isOpen} toggle={this.handleHideModal}>
                <ModalHeader toggle={this.handleHideModal}><TransComponent i18nKey="Alert" /></ModalHeader>
                <ModalBody>
                    <TransComponent i18nKey={flashMesage} />
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default red" onClick={this.handleHideModal}><TransComponent i18nKey="Ok" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

function mapStateToProps (state) {
    return {
        flash: getLatestMessage(state)
    }
}

export default connect(mapStateToProps)(FlashMessagesContainer)