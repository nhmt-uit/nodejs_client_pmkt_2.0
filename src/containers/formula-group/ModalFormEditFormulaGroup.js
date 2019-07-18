import React, {Component} from 'react'

import {Modal, ModalBody, ModalFooter, ModalHeader} from "reactstrap";
import {TransComponent} from 'my-components'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import { getFormulaGroup, toggleModalEditFormulaGroup} from 'my-actions/formula-group/FormulaGroupAction';
import {FormFormulaGroupContainer, FormAssignFormulaGroupContainer, ListFormulaByForumulaGroupContainer} from 'my-containers/formula-group'

class ModalFormEditFormulaGroup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: 'update',
            item: {},
        }
    }

    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formFormulaGroupDetailSaveStatus && this.props.isOpenModalEditFormula) {
            this.props.getFormulaGroup()
        }
        if(this.props.formAssignFormulaGroupSaveStatus && this.props.isOpenModalEditFormula) {
            this.props.getFormulaGroup()
        }
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    callEditFormulaGroup = (item) => {
        this.props.toggleModalEditFormulaGroup()
        this.setState({
            item: item,
        })
    }

    render() {
        const { item } = this.state;
        var status = false;
        if(item.banker){
            status = true;
        }
        return (
            <Modal className={status ? "modal-xxl" : '' } isOpen={this.props.isOpenModalEditFormula} scrollable={true} toggle={_ => this.props.toggleModalEditFormulaGroup()}>
                <ModalHeader toggle={_ => this.props.toggleModalEditFormulaGroup()}><TransComponent i18nKey="Update formula"/></ModalHeader>
                <ModalBody>
                    { status ?
                        <div className="row">
                            <div className="col-md-4">
                                <FormAssignFormulaGroupContainer {...this.state} />
                            </div>
                            <div className="col-md-8">
                                <ListFormulaByForumulaGroupContainer {...this.state} />
                            </div>
                        </div>
                        :
                        <FormFormulaGroupContainer {...this.state}/>
                    }
                </ModalBody>
                <ModalFooter />
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalEditFormula: state.FormulaGroupReducer.isOpenModalEditFormula,
        //Response Modal Formula Group Assign Saved
        formFormulaGroupDetailSaveStatus: state.FormulaGroupReducer.formSaveStatus,
        formFormulaGroupDetailGroupSaveResponse: state.FormulaGroupReducer.formSaveResponse,
        //Response Modal Formula Group Assign Saved
        formAssignFormulaGroupSaveStatus: state.FormulaGroupReducer.formAssignSaveStatus,
        formAssignFormulaGroupSaveResponse: state.FormulaGroupReducer.formAssignSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        toggleModalEditFormulaGroup: params => {dispatch(toggleModalEditFormulaGroup(params))},
        getFormulaGroup: params => dispatch(getFormulaGroup(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ModalFormEditFormulaGroup);

