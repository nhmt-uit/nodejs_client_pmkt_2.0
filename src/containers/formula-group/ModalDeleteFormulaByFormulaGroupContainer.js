import React, { Component } from 'react';
import { connect } from 'react-redux'
import {get as _get} from 'lodash'

import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'
import { FormulaGroupService } from 'my-services/formula-group'
import { TransComponent } from 'my-components'
import { initFormulaList, toggleModalDeleteFormulaByFormulaGroup, getFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction'

class ModalDeleteFormulaByFormulaGroupContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(newProps.isOpenModalDeleteFormula !== this.props.isOpenModalDeleteFormula)
            return true
        return false;
    }


    handleDelete = async _ => {
        if (this.props.paramsDeleteFormula.type === "single") {
            const payload = {
                banker_id: this.props.paramsDeleteFormula.banker_id,
                formula_group_id: this.props.paramsDeleteFormula.formula_group_id,
                f_pattern_id: this.props.paramsDeleteFormula.f_pattern_id,
            }

            await FormulaGroupService.deleteOneByOne(payload)
                .then( () => {
                    this.props.getFormulaGroup()
                })
            this.props.initFormulaList({formula_group_select: this.props.paramsDeleteFormula.formula_group_id, banker_id: this.props.paramsDeleteFormula.banker_id})
            this.props.toggleModalDeleteFormulaByFormulaGroup()
        } else if (this.props.paramsDeleteFormula.type === "multiple") {
            const payload = {
                banker_id: this.props.paramsDeleteFormula.banker_id,
                formula_group_id: this.props.paramsDeleteFormula.formula_group_id,
                'f_pattern_ids[]': this.props.paramsDeleteFormula.f_pattern_ids,
            }
            await FormulaGroupService.multiDelete(payload)
                .then( () => {
                    this.props.getFormulaGroup()
                })
            this.props.initFormulaList({formula_group_select: this.props.paramsDeleteFormula.formula_group_id, banker_id: this.props.paramsDeleteFormula.banker_id})
            this.props.toggleModalDeleteFormulaByFormulaGroup()
        }
    }

    render() {
        let message = null
        const deleteType = _get(this.props, 'paramsDeleteFormula.type')
        if (deleteType && this.props.paramsDeleteFormula.type === "single") {
            message = <TransComponent i18nKey="Do you want remove this formula ?" />
        }  else if (deleteType && this.props.paramsDeleteFormula.type === "multiple") {
            message = <TransComponent i18nKey="Do you want remove all checked?" />
        }

        return (
            <Modal isOpen={this.props.isOpenModalDeleteFormula} toggle={_ => this.props.toggleModalDeleteFormulaByFormulaGroup()}>
                <ModalHeader toggle={_ => this.props.toggleModalDeleteFormulaByFormulaGroup()}><TransComponent i18nKey="confirm" /></ModalHeader>
                <ModalBody>
                    {message}
                </ModalBody>
                <ModalFooter>
                    <Button color="btn btn-default green" onClick={this.handleDelete}><TransComponent i18nKey="confirm" /></Button>{' '}
                    <Button color="btn btn-default red" onClick={_ => this.props.toggleModalDeleteFormulaByFormulaGroup()}><TransComponent i18nKey="Cancel" /></Button>
                </ModalFooter>
            </Modal>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModalDeleteFormula : state.FormulaGroupReducer.isOpenModalDeleteFormula,
        paramsDeleteFormula : state.FormulaGroupReducer.paramsDeleteFormula,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        initFormulaList: params => dispatch(initFormulaList(params)),
        toggleModalDeleteFormulaByFormulaGroup: (params) => {dispatch(toggleModalDeleteFormulaByFormulaGroup(params))},
        getFormulaGroup: () => dispatch(getFormulaGroup()),
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalDeleteFormulaByFormulaGroupContainer);