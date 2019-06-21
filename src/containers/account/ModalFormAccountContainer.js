import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

class ModalFormAccountContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "update") this.modalTitle = this.props.t("Update account")
    }
    render() {
        const { t, isOpen, toggle } = this.props
        
        return (
            <Modal isOpen={isOpen} toggle={toggle}>
                <ModalHeader toggle={toggle}>{this.modalTitle}</ModalHeader>
                <ModalBody>{t("confirm")}</ModalBody>
            </Modal>
        );
    }
}



const mapStateToProps = state => {
    
}

const mapDispatchToProps = (dispatch) => {

};

export default compose(
    connect(null, null),
    withTranslation()
)(ModalFormAccountContainer);