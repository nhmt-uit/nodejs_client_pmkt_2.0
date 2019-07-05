import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { get as _get, isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'
import { renderSelectField, renderError } from 'my-utils/components/redux-form/render-form'
import { initFormulaGroup, initFormulaGroupDetail, initFormulaList, saveFormulaGroupAssign, resetFormAssignSaveResponse, toggleModalFormulaGroup, resetFormSaveResponse } from 'my-actions/formula-group/FormulaGroupAction'
import { toggleModalFormula} from 'my-actions/formula/FormulaAction'
import { ModalFormFormulaContainer } from 'my-containers/formula'
import { ModalFormFormulaGroupContainer } from 'my-containers/formula-group'

class FormAssignFormulaGroupContainer extends Component {

    componentWillMount() {
        /*
        |--------------------------------------------------------------------------
        | Init Form Data
        |--------------------------------------------------------------------------
        */
        this.props.initFormulaGroup()
        this.props.initFormulaGroupDetail()
        // Init Default Form Value
        this.handleInitialValue()
    }

    componentDidUpdate(prevProps){
        if(!_isEqual(prevProps.optFormulaGroup, this.props.optFormulaGroup)
            || !_isEqual(prevProps.optBanker, this.props.optBanker)
            || !_isEqual(prevProps.optFormula, this.props.optFormula)
         ) {
            // Init Default Form Value
            this.handleInitialValue()
        }

        // Detect Render List Formula
        if(!_isEqual(_get(prevProps.initialValues, 'formula_group_select'), _get(this.props.initialValues, 'formula_group_select'))
            || !_isEqual(_get(prevProps.initialValues, 'company'), _get(this.props.initialValues, 'company'))
        ) {
            // Render List Formula
            this.handleLoadFormulaList()
        }

        // Handle Form Formula Group Detail Response
        if(this.props.formFormulaGroupDetailSaveStatus === true
            && _isEqual(prevProps.optFormulaGroup, this.props.optFormulaGroup)) {
            const newFormulaGroupId = this.props.formFormulaGroupDetailGroupSaveResponse.data.formulaGroupId
            this.props.initFormulaGroupDetail().then(_ => {
                this.props.initialize({...this.props.initialValues,
                    formula_group_select: this.props.optFormulaGroup.find(item => item.value === newFormulaGroupId),
                })
            })
        }

        // Handle Form Formula Group Detail Response
        if(this.props.formFormulaSaveStatus === true) {
            const newFormulaId = this.props.formFormulaSaveResponse.data.formulaId
            this.props.initFormulaGroup().then(_ => {
                this.props.initialize({...this.props.initialValues,
                    formula_select: this.props.optFormula.find(item => item.value === newFormulaId),
                })
            })
        }
    }

    handleInitialValue = _ =>{
        if(this.props.formType === "create") {
            // console.log(this.props, this.props.defaultBankerId)
            const defaultBanker = !_isEmpty(this.props.defaultBankerId) ? this.props.optBanker.find(item => item.id === this.props.defaultBankerId) : this.props.optBanker[0]
            const optFormula = this.props.optFormula.filter(item => item.banker_id === defaultBanker.value)
            this.props.initialize({...this.props.initialValues,
                company: defaultBanker,
                formula_select: optFormula[0],
            })
        }
    }


    handleChangeBanker = banker => {
        const optFormula = this.props.optFormula.filter(item => item.banker_id === banker.value)
        this.props.initialize({...this.props.initialValues,
            formula_select: optFormula[0],
        })
    }

    handleLoadFormulaList = _ => {
        const dataFormulaGroupSelect = _get(this.props.initialValues, 'formula_group_select.value')
        const dataCompany = _get(this.props.initialValues, 'company.value')
        const payload = {}
        if(!_isEmpty(dataFormulaGroupSelect)) payload.formula_group_select = dataFormulaGroupSelect
        if(!_isEmpty(dataFormulaGroupSelect)) payload.banker_id = dataCompany
        if(!_isEmpty(payload)) this.props.initFormulaList(payload)
    }


    handleSubmit = e => {
        const payload = {
            formula_group_select: _get(this.props.initialValues, 'formula_group_select.value'),
            formula_select: _get(this.props.initialValues, 'formula_select.value'),
            company: _get(this.props.initialValues, 'company.value'),
        }

        this.props.saveFormulaGroupAssign(payload)
    }

    renderAlert = _ => {
        const { formAssignFormulaGroupSaveStatus, formAssignFormulaGroupSaveResponse } = this.props
        if(formAssignFormulaGroupSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormAssignSaveResponse} />
                    <span><b> {formAssignFormulaGroupSaveResponse.data.message} </b></span>
                </div>
            )
        } else if(formAssignFormulaGroupSaveStatus === true) {// Render List Formula
            this.handleLoadFormulaList()
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormAssignSaveResponse} />
                    <span><b> {formAssignFormulaGroupSaveResponse.data.message} </b></span>
                </div>
            )
        }
        return null
    }
    
    render() {
        const bankerId = _get(this.props.initialValues, 'company.value')
        const optFormula = this.props.optFormula.filter(item => item.banker_id === bankerId)
        return (
            <form name="form_assign_formula_group">
                <div className="form-body">
                    {this.renderAlert()}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula group" /></label>
                        <div className="input-group">
                            <Field
                                name="formula_group_select"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={this.props.optFormulaGroup}
                                menuPosition="fixed"
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button" onClick={_ => this.props.toggleModalFormulaGroup()}><i className="fa fa-plus" /></button>
                            </span>
                        </div>
                        <Field name="formula_group_select"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Company" /></label>
                        <Field
                            name="company"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={this.props.optBanker}
                            menuPosition="fixed"
                            onChange={this.handleChangeBanker}
                            isDisabled={this.props.defaultBankerId}
                            />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula" /></label>
                        <div className="input-group">
                            <Field
                                name="formula_select"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optFormula}
                                menuPosition="fixed"
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button" onClick={_ => this.props.toggleModalFormula()}><i className="fa fa-plus" /></button>
                            </span>
                        </div>
                        <Field name="formula_select"component={renderError} />
                    </div>

                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid} onClick={this.handleSubmit}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>

                {/* <ModalFormAccountContainer isOpen={true} toggle={_ => null} formType="create" /> */}
                <ModalFormFormulaContainer formType="create" defaultBankerId={bankerId}/>
                <ModalFormFormulaGroupContainer formType="create" />
            </form>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.formula_group_select) {
        errors.formula_group_select = 'Value is not empty'
    }

    if (!values.formula_select) {
        errors.formula_select = 'Value is not empty'
    }

    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_assign_formula_group.values'),

        // Handel Formua Group
        optFormulaGroup: state.FormulaGroupReducer.optFormulaGroup,
        optBanker: state.FormulaGroupReducer.optBanker,
        optFormula: state.FormulaGroupReducer.optFormula,

        //Response Modal Formula Group Assign Saved
        formAssignFormulaGroupSaveStatus: state.FormulaGroupReducer.formAssignSaveStatus,
        formAssignFormulaGroupSaveResponse: state.FormulaGroupReducer.formAssignSaveResponse,
        
        //Response Modal Formula Group Assign Saved
        formFormulaGroupDetailSaveStatus: state.FormulaGroupReducer.formSaveStatus,
        formFormulaGroupDetailGroupSaveResponse: state.FormulaGroupReducer.formSaveResponse,

        //Response Modal Formula Group Detail Saved
        formFormulaSaveStatus: state.FormulaReducer.formSaveStatus,
        formFormulaSaveResponse: state.FormulaReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        initFormulaGroup: async _ => dispatch(initFormulaGroup()),
        initFormulaGroupDetail: _ => dispatch(initFormulaGroupDetail()),
        initFormulaList: params => dispatch(initFormulaList(params)),
        saveFormulaGroupAssign: params => dispatch(saveFormulaGroupAssign(params)),
        resetFormAssignSaveResponse: params => dispatch(resetFormAssignSaveResponse(params)),
        // Handel Modal Form Formula
        toggleModalFormula:  _ => dispatch(toggleModalFormula()),
        // Handel Modal Form Formula
        toggleModalFormulaGroup:  _ => dispatch(toggleModalFormulaGroup()),
        resetFormSaveResponse:  _ => dispatch(resetFormSaveResponse()),
    };
};


export default compose(
    reduxForm({
        form: 'form_assign_formula_group',
        validate,
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormAssignFormulaGroupContainer)
