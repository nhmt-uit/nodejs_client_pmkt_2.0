import React, { Component } from 'react'
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

import { TransComponent } from 'my-components'
import { FormAssignFormulaGroupContainer, ListFormulaByForumulaGroupContainer } from 'my-containers/formula-group'
import { toggleModalAssignFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction'

class ModalFormAssignFormulaGroupContainer extends Component {
    modalTitle = ''
    componentDidMount() {
        if(this.props.formType === "create") this.modalTitle = <TransComponent i18nKey="Create formula" />
        if(this.props.formType === "update") this.modalTitle = <TransComponent i18nKey="Update formula" />
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formSaveStatus && this.props.isOpenModalAssign) {
            this.props.toggleModalAssignFormulaGroup()
        }
    }

    render() {
        return (
            <Modal className="modal-xxl" isOpen={this.props.isOpenModalAssign} toggle={_ => this.props.toggleModalAssignFormulaGroup()} scrollable={true} >
                <ModalHeader toggle={_ => this.props.toggleModalAssignFormulaGroup()}>{this.modalTitle}</ModalHeader>
                <ModalBody>
                    <div className="row">
                        <div className="col-md-4">
                            <FormAssignFormulaGroupContainer {...this.props} />
                        </div>
                        <div className="col-md-8">
                            <ListFormulaByForumulaGroupContainer {...this.props} />
                        </div>
                    </div>
                    
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}


const mapStateToProps = state => {
    return {
        isOpenModalAssign: state.FormulaGroupReducer.isOpenModalAssign,
        formSaveStatus: state.FormulaGroupReducer.formSaveStatus,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalAssignFormulaGroup:  _ => dispatch(toggleModalAssignFormulaGroup()),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormAssignFormulaGroupContainer);