import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { withTranslation } from 'react-i18next'
import { get as _get, isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'
import { renderSelectField, renderError } from 'my-utils/components/redux-form/render-form'
import { requestInitFormData, saveFormula } from 'my-actions/formula/FormulaAction'
import { FormulaService } from 'my-services/formula'

class FormFormulaContainer extends Component {

    componentWillMount() {
        /*
        |--------------------------------------------------------------------------
        | Init Form Data
        |--------------------------------------------------------------------------
        */
        this.props.requestInitFormData()
        
        // Init Default Value
        this.handleInitialValue()
    }

    componentDidUpdate(prevProps){
        if(!_isEqual(prevProps.optBanker, this.props.optBanker)
            || !_isEqual(prevProps.optFormulaType, this.props.optFormulaType)
            || !_isEqual(prevProps.optCurrency, this.props.optCurrency)
         ) {
            // Init Default Value
            this.handleInitialValue()
        }
    }

    handleInitialValue = _ =>{
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
            <form name="form_formula">
                <div className="form-body">
                    {/* {this.renderAlert()} */}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula name" /></label>
                        <Field
                            name="formula_name"
                            type="text"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                            readOnly={true}
                        />
                        <Field name="formula_name"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Code" /></label>
                        <Field
                            name="company"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={this.props.optBanker}
                            onChange={this.handleChangeBanker}
                            />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Formula type" /></label>
                        <Field
                            name="formula_type"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={optFormulaType}
                            />
                        <Field name="formula_type"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Currency" /></label>
                        <Field
                            name="currency"
                            className="basic-single"
                            component={renderSelectField}
                            isSearchable={true}
                            options={this.props.optCurrency}
                            />
                    </div>
                    { !_isEmpty(dataFormulaType) && !_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so")) ?
                        <div className="form-group">
                            <label><TransComponent i18nKey="Ratio" /></label>
                            <Field
                                name="ratio"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                            />
                            <Field name="ratio"component={renderError} />
                        </div>
                        : null
                    }
                    { !_isEmpty(dataFormulaType) && !_isEmpty(dataFormulaType.data.filter(item => item.dis === "gia_thau")) ?
                        <div className="form-group">
                            <label><TransComponent i18nKey="Price" /></label>
                            <Field
                                name="price"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                            />
                            <Field name="price"component={renderError} />
                        </div>
                        : null
                    }
                    
                    { !_isEmpty(dataFormulaType) && !_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_1")) ?
                        <div className="form-group">
                            <label><TransComponent i18nKey="Factor 1" /></label>
                            <Field
                                name="he_so_1"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                onKeyUp={this.handleChangeHeSo}
                            />
                            <Field name="he_so_1"component={renderError} />
                        </div>
                        : null
                    }
                    { !_isEmpty(dataFormulaType) && !_isEmpty(dataFormulaType.data.filter(item => item.dis === "he_so_2")) ?
                        <div className="form-group">
                            <label><TransComponent i18nKey="Factor 2" /></label>
                            <Field
                                name="he_so_2"
                                type="text"
                                component="input"
                                className="form-control form-control-solid placeholder-no-fix"
                                autoComplete="off"
                                onKeyUp={this.handleChangeHeSo}
                            />
                            <Field name="he_so_2"component={renderError} />
                        </div>
                        : null
                    }
                    <div className="form-group">
                        <label><TransComponent i18nKey="Result" /> = {this.renderResult()}</label>
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Pay/Rec" /></label>
                        <div className="can-toggle">
                            <Field
                                id="giaonhan"
                                name="giaonhan"
                                type="checkbox"
                                component="input"
                                autoComplete="off"
                            />
                            <label htmlFor="giaonhan">
                                <div className="can-toggle__switch" data-checked={this.props.t("Pay")} data-unchecked={this.props.t("Receive")}></div>
                            </label>
                        </div>
                    </div>
                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid} onClick={this.handleSubmit}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>
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
        initialValues: _get(state, 'form.form_formula.values'),
        optBanker: state.FormulaReducer.optBanker,
        optFormulaType: state.FormulaReducer.optFormulaType,
        optCurrency: state.FormulaReducer.optCurrency,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        saveFormula: payload => dispatch(saveFormula(payload)),
        requestInitFormData: _ => dispatch(requestInitFormData()),
    };
};


export default compose(
    reduxForm({
        form: 'form_formula',
        asyncValidate,
        validate,
    }),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(FormFormulaContainer)
