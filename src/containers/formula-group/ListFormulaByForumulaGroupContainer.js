import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from "redux-form";
import { get as _get, isEmpty as _isEmpty } from 'lodash'

import { ModalDeleteFormulaByFormulaGroupContainer } from 'my-containers/formula-group'
import { TransComponent } from 'my-components'
import { initFormulaList, toggleModalDeleteFormulaByFormulaGroup } from 'my-actions/formula-group/FormulaGroupAction'
import { FormulaGroupService } from 'my-services/formula-group'
import { Helpers } from 'my-utils'

class ListFormulaByForumulaGroupContainer extends Component {

    state = {
        f_pattern_ids: [],
        selectedFormulas: [],
        updateFormulaRes: {}
    }

    
    componentWillReceiveProps(newProps) {
        // this.initDetailData(account_id)
    }

    handleDeleteFormula = formula => {
        const params = {
            type: 'single',
            f_pattern_id: formula.formula.id,
            formula_group_id: _get(this.props.initialValues, 'formula_group_select.value'),
            banker_id: _get(this.props.initialValues, 'company.value'),
        }
        this.props.toggleModalDeleteFormulaByFormulaGroup(params)
    }

    handleMultipleDeleteFormula = formula => {
        const params = {
            type: 'multiple',
            f_pattern_ids: this.state.f_pattern_ids,
            formula_group_id: _get(this.props.initialValues, 'formula_group_select.value'),
            banker_id: _get(this.props.initialValues, 'company.value'),
        }
        this.props.toggleModalDeleteFormulaByFormulaGroup(params)
    }

    handleCheckFormula = (e, item) => {
        const isChecked = e.target.checked;
        const formulaId = item.formula.id
        if(isChecked) {
            this.state.f_pattern_ids.push(formulaId)
        } else {
            this.state.f_pattern_ids = this.state.f_pattern_ids.filter(id => id !== formulaId)
        }
        this.setState({f_pattern_ids : this.state.f_pattern_ids})
    }


    renderChangeFormula = selectedItem => {
        const optFormulaPatternList = this.props.optFormulaPatternList
        
        const selectedEdit = this.state.selectedFormulas.find(item => item.formula.id === selectedItem.formula.id && !_isEmpty(item.newFormulaId))
        let selectValue = _isEmpty(selectedEdit) ? selectedItem.formula.id : selectedEdit.newFormulaId
        return (
            <div className="form-group">
                <select className="form-control" onChange={e => this.handleEditFormula('change', selectedItem, e)} value={selectValue}>
                    {
                        optFormulaPatternList.map(item => {
                            return (
                                <option className="text-uppercase" key={item.value} value={item.value}>
                                    {item.label.toUpperCase()}
                                </option>
                            )
                        })
                    }
                </select>
            </div>
        )
    }

    handleEditFormula = (type, selectedItem, e) => {
        let selectedFormulas = this.state.selectedFormulas
        if(type === 'edit') {
            delete selectedItem.newFormulaId
            selectedFormulas.push(selectedItem)
        }

        if(type === 'close') {
            selectedFormulas = selectedFormulas.filter(item => item.formula.id !== selectedItem.formula.id)
        }

        if(type === 'change') {
            selectedFormulas = selectedFormulas.map(item => {
                if( item.formula.id === selectedItem.formula.id) item.newFormulaId = e.target.value
                return item
            })
        }
        
        this.setState({selectedFormulas})
    }

    handleUpdateFormula = _ => {
        /*
        |--------------------------------------------------------------------------
        | @input: {formula_group_id, banker_id, data: [{isEdit, formulaId, formulaAccountGroupId, random}]}
        |--------------------------------------------------------------------------
        */
        const payload = {
            formula_group_id: _get(this.props.initialValues, 'formula_group_select.value'),
            banker_id: _get(this.props.initialValues, 'company.value'),
            data:[]
        }
        this.state.selectedFormulas.forEach(item => {
            if(!_isEmpty(item.newFormulaId)) {
                payload.data.push({
                    isEdit: true,
                    formulaId: item.newFormulaId,
                    formulaAccountGroupId: item.account_formula_group_id,
                    random: Math.random()
                })
            }
        })
        payload.data = JSON.stringify(payload.data)
        FormulaGroupService.updateListFormula(payload).then(async res => {
            if(res.status) {
                //Render List Formula
                this.props.initFormulaList({
                    formula_group_select: _get(this.props.initialValues, 'formula_group_select.value'),
                    banker_id: _get(this.props.initialValues, 'company.value'),
                })
                
                this.setState({
                    selectedFormulas: [],
                    updateFormulaRes: res
                })
            } else {
                this.setState({
                    updateFormulaRes: res
                })
                await Helpers.sleep(3000)
                this.handleClearMessageError()
            }
        })
    }

    handleClearMessageError = _ => {
        this.setState({
            updateFormulaRes: {}
        })
    }
    
    renderDetailData = formulaPatternList => {
        let xhtml = <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
        if (formulaPatternList.length) {
            xhtml = formulaPatternList.map((item, idx) => {
                return (
                    <tr key={idx}>
                        <td> {++idx} </td>
                        <td>
                            { _isEmpty(this.state.selectedFormulas.find(obj => obj.formula.id === item.formula.id)) ?
                                item.formula.tenct.toUpperCase()
                                : this.renderChangeFormula(item)
                            }
                        </td>
                        <td className="text-center">
                            <label className="mt-checkbox uppercase">
                                <input type="checkbox" onChange={e => this.handleCheckFormula(e, item)} checked={this.state.f_pattern_ids.indexOf(item.formula.id) !== -1}  />
                                <span></span>
                            </label>
                        </td>
                        <td className="text-center">
                            { _isEmpty(this.state.selectedFormulas.find(obj => obj.formula.id === item.formula.id)) ?
                                <a href="#/" className="green" onClick={_ => this.handleEditFormula('edit', item)}> <i className="fa fa-edit" /> </a>
                                : <a href="#/" className="green" onClick={_ => this.handleEditFormula('close', item)}> <TransComponent i18nKey="Close" /> </a>
                            }
                        </td>
                        <td className="text-center">
                            <a href="#/" className="font-red-sunglo" onClick={_ => this.handleDeleteFormula(item)}> <i className="fa fa-close" /> </a>
                        </td>
                    </tr>
                )
            })
        }
        return xhtml
    }

    render() {
        const { formulaPatternList } = this.props
        const updateFormulaRes = this.state.updateFormulaRes
        return (
            <div className="portlet light bordered">
                <div className="portlet-title font-red-sunglo">
                    <div className="caption">
                        <span className="caption-subject font-green bold uppercase"><TransComponent i18nKey="Detail" /></span>
                    </div>
                </div>
                <div className="portlet-body">
                    {!_get(updateFormulaRes, 'status', true) ?
                        <div className="alert alert-danger">
                            <button className="close" onClick={this.handleClearMessageError}  />
                            <span><b> <TransComponent i18nKey={_get(updateFormulaRes, 'res.data.message')} /> </b></span>
                        </div>
                        : null
                    }
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered table-hover table-animation">
                            <thead>
                                <tr className="font-red-sunglo">
                                    <th className="text-center"> # </th>
                                    <th className="text-center"> <TransComponent i18nKey="Formula" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Multi select" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Edit" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Delete" /> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderDetailData(formulaPatternList)}
                            </tbody>
                        </table>
                    </div>
                    {formulaPatternList.length ?
                        <div className="form-actions text-right" style={{marginTop: '15px'}}>
                            <button type="button" className="btn red" disabled={!this.state.f_pattern_ids.length} onClick={this.handleMultipleDeleteFormula}>
                                <TransComponent i18nKey="Delete selected" />
                            </button>
                            <button type="button" className="btn red" disabled={!this.state.selectedFormulas.length} onClick={this.handleUpdateFormula}>
                                <TransComponent i18nKey="Save" />
                            </button>
                        </div>
                        : null
                    }
                </div>

                <ModalDeleteFormulaByFormulaGroupContainer />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_assign_formula_group.values'),

        optFormulaPatternList: state.FormulaGroupReducer.optFormulaPatternList,
        formulaPatternList: state.FormulaGroupReducer.formulaPatternList
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initFormulaList: params => dispatch(initFormulaList(params)),
        toggleModalDeleteFormulaByFormulaGroup: params => dispatch(toggleModalDeleteFormulaByFormulaGroup(params)),
    };
};

export default compose(
    reduxForm({
        form: 'form_assign_formula_group',
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(ListFormulaByForumulaGroupContainer)
