import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { get as _get, isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'
import { renderError } from 'my-utils/components/redux-form/render-form'
import { saveFormulaGroupDetail, resetFormSaveResponse } from 'my-actions/formula-group/FormulaGroupAction'
import { FormulaGroupService } from 'my-services/formula-group'


class FormFormulaGroupContainer extends Component {

    componentWillMount() {
        // Init Default Form Value
        this.handleInitialValue()
    }

    handleInitialValue = _ =>{
        if(this.props.formType === "create") {
           
        }
    }

    handleSubmit = e => {
        const payload = {
            name: _get(this.props.initialValues, 'name'),
        }
        this.props.saveFormulaGroupDetail(payload)
    }

    renderAlert = _ => {
        const { formFormulaGroupSaveStatus, formFormulaGroupSaveResponse } = this.props
        if(formFormulaGroupSaveStatus === false) {
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formFormulaGroupSaveResponse.data.message} </b></span>
                </div>
            )
        } else if(formFormulaGroupSaveStatus === true) {
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> {formFormulaGroupSaveResponse.data.message} </b></span>
                </div>
            )
        }
        return null
    }
    
    render() {
        return (
            <form name="form_formula_group">
                <div className="form-body">
                    {this.renderAlert()}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula group" /></label>
                        <Field
                            name="name"
                            type="text"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                        />
                        <Field name="name"component={renderError} />
                    </div>
                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid} onClick={this.handleSubmit}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>
            </form>
        );
    }
}

const asyncValidate = values => {
    const errors = {}
    return new Promise((resolve, reject) => {
        //Validate formula name
        FormulaGroupService.validatorFormulaGroupDetail(values.name).then(res => {
            if(res.status === false) {
                errors.name = res.res.data.message
                return reject(errors)
            }
            resolve()
        })
    });
}



const validate = values => {
    const errors = {}
    if (!values.name) {
        errors.name = 'Value is not empty'
    }

    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_formula_group.values'),

        //Response Modal Formula Saved
        formFormulaGroupSaveStatus: state.FormulaGroupReducer.formSaveStatus,
        formFormulaGroupSaveResponse: state.FormulaGroupReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        saveFormulaGroupDetail: params => dispatch(saveFormulaGroupDetail(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    };
};


export default compose(
    reduxForm({
        form: 'form_formula_group',
        validate,
        asyncValidate,
        asyncChangeFields: ['name']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormFormulaGroupContainer)
