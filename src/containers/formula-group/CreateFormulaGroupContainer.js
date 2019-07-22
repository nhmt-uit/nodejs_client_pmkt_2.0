import React, {Component} from 'react'
import { TransComponent } from 'my-components';
import { ModalFormFormulaGroupContainer, ModalFormAssignFormulaGroupContainer } from 'my-containers/formula-group'
import { toggleModalFormulaGroup, getFormulaGroup, toggleModalAssignFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

class CreateFormulaGroupContainer extends Component {
    componentDidUpdate(){
        // Hide modal after save success
        if(this.props.formFormulaGroupDetailSaveStatus && this.props.isOpenModal) {
            this.props.getFormulaGroup()
        }
        if(this.props.formAssignFormulaGroupSaveStatus && this.props.isOpenModalAssign) {
            this.props.getFormulaGroup()
        }
    }

    render() {
        return (
            <div>
                <div className="form-group text-right">
                    <a href="#/" type="submit" className="btn btn-default red" onClick={() => this.props.toggleModalFormulaGroup()}>
                        <TransComponent i18nKey="Add new"/>
                    </a>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={() => this.props.toggleModalAssignFormulaGroup()}>
                        <TransComponent i18nKey="Add Formula to group"/>
                    </a>
                </div>
                <ModalFormFormulaGroupContainer formType="create"/>
                <ModalFormAssignFormulaGroupContainer formType="create"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModal: state.FormulaGroupReducer.isOpenModal,
        isOpenModalAssign: state.FormulaGroupReducer.isOpenModalAssign,
        //Response Modal Formula Group Assign Saved
        formFormulaGroupDetailSaveStatus: state.FormulaGroupReducer.formSaveStatus,
        formFormulaGroupDetailGroupSaveResponse: state.FormulaGroupReducer.formSaveResponse,
        //Response Modal Formula Group Assign Saved
        formAssignFormulaGroupSaveStatus: state.FormulaGroupReducer.formAssignSaveStatus,
        formAssignFormulaGroupSaveResponse: state.FormulaGroupReducer.formAssignSaveResponse,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalFormulaGroup:  _ => dispatch(toggleModalFormulaGroup()),
        getFormulaGroup: () => dispatch(getFormulaGroup()),

        toggleModalAssignFormulaGroup:  _ => dispatch(toggleModalAssignFormulaGroup()),

    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(CreateFormulaGroupContainer);