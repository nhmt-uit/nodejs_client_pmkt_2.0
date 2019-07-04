import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { withTranslation } from 'react-i18next'
import { get as _get, isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'
import { renderSelectField, renderError } from 'my-utils/components/redux-form/render-form'
import { requestInitFormData, saveFormula } from 'my-actions/formula/FormulaAction'
import { toggleModalFormula} from 'my-actions/formula/FormulaAction'
import { FormulaService } from 'my-services/formula'
import { ModalFormFormulaContainer } from 'my-containers/formula'

class FormAssignFormulaGroupContainer extends Component {

    componentWillMount() {
        /*
        |--------------------------------------------------------------------------
        | Init Form Data
        |--------------------------------------------------------------------------
        */
        this.props.requestInitFormData()
        
    }

    componentDidUpdate(prevProps){
        if(!_isEqual(prevProps.optBanker, this.props.optBanker)
            || !_isEqual(prevProps.optFormulaType, this.props.optFormulaType)
            || !_isEqual(prevProps.optCurrency, this.props.optCurrency)
         ) {
            // Init Default Value
            if(this.props.formType === "create") {
                console.log(this.props, this.props.defaultBankerId)
                const defaultBanker = !_isEmpty(this.props.defaultBankerId) ? this.props.optBanker.find(item => item.id === this.props.defaultBankerId) : this.props.optBanker[0]
                const optFormulaType = this.props.optFormulaType.filter(item => item.banker_id === defaultBanker.value)
                this.props.initialize({...this.props.initialValues,
                    company: defaultBanker,
                    formula_type: optFormulaType[0],
                    currency: this.props.optCurrency[0],
                    giaonhan: true,
                    he_so_1: 1,
                    he_so_2: 1,
                })
            }
        }

        if(this.props.formFormulaSaveStatus === true) {

        }
    }


    handleChangeBanker = banker => {
        const optFormulaType = this.props.optFormulaType.filter(item => item.banker_id === banker.value)
        this.props.initialize({...this.props.initialValues,
            formula_type: optFormulaType[0],
        })
    }

    handleChangeHeSo = _ => {
        const dataFormulaType = _get(this.props.initialValues, 'formula_type')
        const dataHeSo1 = _get(this.props.initialValues, 'he_so_1')
        const dataHeSo2 = _get(this.props.initialValues, 'he_so_2')
        if (_isEmpty(dataHeSo1) || !dataHeSo1) {
            console.log("empty he so 1")
            this.props.initialize({...this.props.initialValues,
                he_so_1: 1,
            })
            this.props.touch('he_so_1')
        }
        if (_isEmpty(dataHeSo2) || !dataHeSo2) {
            this.props.initialize({...this.props.initialValues,
                he_so_2: 1,
            })
        }
        this.renderFormulaName()
    }

    handleSubmit = e => {
        const dataFormulaType = _get(this.props.initialValues, 'formula_type')

        const payload = {
            formula_name: _get(this.props.initialValues, 'formula_name'),
            company: _get(this.props.initialValues, 'company.value'),
            formula_type: _get(this.props.initialValues, 'formula_type.value'),
            currency: _get(this.props.initialValues, 'currency.value'),
            giaonhan: _get(this.props.initialValues, 'giaonhan'),
        }

        if (!_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so")))
            payload[`field_${dataFormulaType.data.find(item => item.dis === "he_so").value}`] = _get(this.props.initialValues, 'ratio')
        if (!_isEmpty(dataFormulaType.data.filter(item => item.dis === "gia_thau")))
            payload[`field_${dataFormulaType.data.find(item => item.dis === "gia_thau").value}`] = _get(this.props.initialValues, 'price')
        if (!_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_1")))
            payload[`field_${dataFormulaType.data.find(item => item.dis === "he_so_1").value}`] = _get(this.props.initialValues, 'he_so_1')
        if (!_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_2")))
            payload[`field_${dataFormulaType.data.find(item => item.dis === "he_so_2").value}`] = _get(this.props.initialValues, 'he_so_2')

        this.props.saveFormula(payload)
    }

    renderFormulaName = _ => {
        const formula_name = _get(this.props.initialValues, 'formula_name')
        const dataBanker = _get(this.props.initialValues, 'company')
        const dataFormulaType = _get(this.props.initialValues, 'formula_type')
        const dataCurrency = _get(this.props.initialValues, 'currency')
        const dataRatio = _get(this.props.initialValues, 'ratio')
        const dataPrice = _get(this.props.initialValues, 'price')
        const dataHeSo1 = _get(this.props.initialValues, 'he_so_1')
        const dataHeSo2 = _get(this.props.initialValues, 'he_so_2')
        const dataGiaoNhan = _get(this.props.initialValues, 'giaonhan')
        let result = ''
        if(!_isEmpty(dataBanker) && !_isEmpty(dataFormulaType) && !_isEmpty(dataCurrency)) {
            result = `${dataBanker.label}-${dataCurrency.label}`
            result += dataPrice ? `-${dataPrice}`: ""
            result += dataRatio ? `-${dataRatio}` : ""
            result += !_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_1")) && dataHeSo1 ? `-${dataHeSo1}`: ""
            result += !_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_2")) && dataHeSo2 ? `-${dataHeSo2}` : ""
            result += `-${dataFormulaType.short}`
            
            if(dataGiaoNhan === false) result += '*(-1)'
        }

        //Set data to redux-form
        if(formula_name !== result) {
            this.props.initialize({...this.props.initialValues,
                formula_name: result,
            })
        }
    }

    renderResult = _ => {
        const dataFormulaType = _get(this.props.initialValues, 'formula_type')
        const dataRatio = _get(this.props.initialValues, 'ratio')
        const dataPrice = _get(this.props.initialValues, 'price')
        const dataHeSo1 = _get(this.props.initialValues, 'he_so_1')
        const dataHeSo2 = _get(this.props.initialValues, 'he_so_2')
        const dataGiaoNhan = _get(this.props.initialValues, 'giaonhan')
        let result = ''
        if(!_isEmpty(dataFormulaType)) {
            for(let x in dataFormulaType.data){
                let label = dataFormulaType.data[x].dis
                if(label === "gia_thau" ) label = dataPrice ? dataPrice : this.props.t("Price")
                if(label === "he_so") label = dataRatio ? dataRatio : this.props.t("Ratio")
                if(label === "he_so_1" ) label = dataHeSo1 ? dataHeSo1 : this.props.t("Factor 1")
                if(label === "he_so_2") label = dataHeSo2 ? dataHeSo2 : this.props.t("Factor 2")

                result += label
            }
            if(dataGiaoNhan === false) result += '*(-1)'
        }
        return result
    }
    
    render() {
        const bankerId = _get(this.props.initialValues, 'company.value')
        const optFormulaType = this.props.optFormulaType.filter(item => item.banker_id === bankerId)
        const dataFormulaType = _get(this.props.initialValues, 'formula_type')
        this.renderFormulaName()
        return (
            <form name="form_assign_formula_group">
                <div className="form-body">
                    {/* {this.renderAlert()} */}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula group" /></label>
                        <div className="input-group">
                            <Field
                                name="formula_group_select"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optFormulaType}
                                />
                            <span className="input-group-btn">
                                <button className="btn green" type="button" onClick={_ => null}><i className="fa fa-plus" /></button>
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
                            options={optFormulaType}
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
                                options={optFormulaType}
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
                <ModalFormFormulaContainer formType="create" defaultBankerId={null}/>
            </form>
        );
    }
}

const asyncValidate = (values, dispatch, props, currentFieldName) => {
    const errors = {}
    return new Promise((resolve, reject) => {
        //Validate formula name
        FormulaService.validatorFormula(values.formula_name).then(res => {
            if(res.status === false) {
                errors.formula_name = res.res.data.message
                return reject(errors)
            }
            resolve()
        })
    });
}

const validate = values => {
    const errors = {}
    if (!values.ratio) {
        errors.ratio = 'Value is not empty'
    } else if (!(/^\d*(\.\d*)?$/).test(values.ratio)) {
        errors.ratio = 'Value must be a number'
    }
    if (!values.price) {
        errors.price = 'Value is not empty'
    } else if (!(/^\d*(\.\d*)?$/).test(values.price)) {
        errors.price = 'Value must be a number'
    }
    if (!values.he_so_1) {
        errors.he_so_1 = 'Value is not empty'
    } else if (!(/^\d*(\.\d*)?$/).test(values.he_so_1)) {
        errors.he_so_1 = 'Value must be a number'
    }
    if (!values.he_so_2) {
        errors.he_so_2 = 'Value is not empty'
    } else if (!(/^\d*(\.\d*)?$/).test(values.he_so_2)) {
        errors.he_so_2 = 'Value must be a number'
    }
    if (!values.formula_type) {
        errors.formula_type = 'Value is not empty'
    }

    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_assign_formula_group.values'),
        optBanker: state.FormulaReducer.optBanker,
        optFormulaType: state.FormulaReducer.optFormulaType,
        optCurrency: state.FormulaReducer.optCurrency,


        //Response Modal Formula Saved
        formFormulaSaveStatus: state.FormulaReducer.formSaveStatus,
        formFormulaSaveResponse: state.FormulaReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        saveFormula: payload => dispatch(saveFormula(payload)),
        requestInitFormData: _ => dispatch(requestInitFormData()),
        // Handel Modal Form Formula
        toggleModalFormula:  _ => dispatch(toggleModalFormula()),
    };
};


export default compose(
    reduxForm({
        form: 'form_assign_formula_group',
        asyncValidate: asyncValidate,
        validate,
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(FormAssignFormulaGroupContainer)
