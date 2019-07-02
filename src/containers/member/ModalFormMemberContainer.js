import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

import { TransComponent } from 'my-components'
import { FormMemberContainer } from 'my-containers/member'

class ModalFormMemberContainer extends Component {
    render() {
        return (
            <Modal isOpen={false} toggle={_ => null}>
                <ModalHeader toggle={_ => null}><TransComponent i18nKey="Create member" /></ModalHeader>
                <ModalBody>
                    <FormMemberContainer />
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}


const mapStateToProps = state => {
    return {

    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormMemberContainer);