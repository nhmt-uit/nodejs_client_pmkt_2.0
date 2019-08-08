import React, {Component} from 'react'
import { TransComponent, LoadingComponent } from 'my-components';
import {Field, reduxForm} from "redux-form";

import {renderError} from 'my-utils/components/redux-form/render-form'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {get as _get, isEmpty as _isEmpty, keyBy} from "lodash";
import { getLanguageManage, saveLanguageManage, resetFormSaveResponse } from 'my-actions/language/LanguageManageAction'
import LanguageManageService from "../../../services/language/LanguageManageService";

class LanguageFormContainer extends Component{
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            submit: true,
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.initialValues){
            var lang_key = nextProps.initialValues.lang_key;
            var vi = nextProps.initialValues.vi;
            var en = nextProps.initialValues.en;
            var cn = nextProps.initialValues.cn;
            if (lang_key && vi && en && cn !== undefined){
                this.setState({submit: false})
            } else { this.setState({ submit: true })}
        }
    }

    componentDidUpdate() {
        const { formSaveStatus } = this.props;
        if(formSaveStatus){
            setTimeout(()=>{
                this.props.getLanguageManage()
                this.props.resetFormSaveResponse()
            }, 2000);
        }
    }

    componentWillMount() {
        this.props.getLanguageManage()
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    callLanguageForm = item => {
        this.setState({
            isEdit: true,
        })
        item.childMap = keyBy(item.child, 'lang_code')
        this.props.initialize({
            ...this.props.initialValues,
            lang_key: item.name,
            vi: _get(item, 'childMap[vi].name', ''),
            en: _get(item, 'childMap[en].name', ''),
            cn: _get(item, 'childMap[cn].name', ''),
            id: _get(item, 'id',''),
        })
    }

    clickAddNew = (e) => {
        this.setState({
            isEdit: false,
            submit: true,
        })
        this.props.destroy('formLanguage');
    }

    saveLanguageManage = (e) => {
        e.preventDefault();
        let id =  _get(this.props.initialValues, 'id','');
        let post = {};
        if(id){
            post = {
                lang_key: _get(this.props.initialValues, 'lang_key'),
                vi: _get(this.props.initialValues, 'vi', ''),
                en: _get(this.props.initialValues, 'en',''),
                cn: _get(this.props.initialValues, 'cn',''),
                id: id,
            }
        } else {
            post = {
                lang_key: _get(this.props.initialValues, 'lang_key'),
                vi: _get(this.props.initialValues, 'vi', ''),
                en: _get(this.props.initialValues, 'en',''),
                cn: _get(this.props.initialValues, 'cn',''),
            }
        }
        this.props.saveLanguageManage(post)
            .then( () => {
                this.setState({
                    isEdit: false,
                })
            })
            .then( () => {
                this.props.destroy('formLanguage');
            })
    }

    renderAlert = _ => {
        const {formSaveStatus, formSaveResponse} = this.props
        if (formSaveStatus === false) {
            setTimeout(()=>{
                this.props.resetFormSaveResponse();
            }, 2000);
            return (
                <div className="alert alert-danger">
                    <button className="close" onClick={this.props.resetFormSaveResponse}/>
                    <span><b> <TransComponent i18nKey={formSaveResponse.data.message}/>  </b></span>
                </div>
            )
        } else if (formSaveStatus === true) {
            setTimeout(()=>{
                this.props.resetFormSaveResponse();
            }, 2000);
            return (
                <div className="alert bg-success">
                    <button className="close" onClick={this.props.resetFormSaveResponse} />
                    <span><b> Successful! </b></span>
                </div>
            )
        }
    };

    render() {
        const { lang, isFetching} = this.props;
        const { isEdit, submit } = this.state;
        var langValue;
        if(!_isEmpty(lang)){
            langValue = lang.map( (item, index) => {
                return(
                    <div className="form-group" key={index}>
                        <label className="control-label"><TransComponent i18nKey={item.name}/></label>
                        <Field className="form-control" component="input" name={item.code} type="text"/>
                        <Field name={item.code} component={renderError}/>
                    </div>
                )
            })
        }

        return (
            <div className="portlet light bordered">
                {this.renderAlert()}
                { isFetching ? <LoadingComponent /> : null }
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject caption-subject font-green bold uppercase"><TransComponent i18nKey="Form"/></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <form role="form">
                        <div className="form-group">
                            <label className="control-label"><TransComponent i18nKey="lang_key"/></label>
                            <Field className="form-control" component="input" name="lang_key" type="text" disabled={isEdit}/>
                            <Field name="lang_key" component={renderError}/>
                        </div>
                        {langValue}
                        <div className="form-actions right">
                            {isEdit ?
                                <button className="btn green" onClick={this.clickAddNew}><TransComponent i18nKey="Add new"/></button> : null}
                            <button type="submit" className="btn red" disabled={this.props.invalid || submit} onClick={this.saveLanguageManage}><TransComponent i18nKey="Save"/></button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const asyncValidate = (values, dispatch, props, currentFieldName) => {
    const errors = {}
    return new Promise((resolve, reject) => {
        //Validate lang_key
        if (currentFieldName === "lang_key") {
            LanguageManageService.validateLanguageKey(values.lang_key).then(res => {
                if (res.status === false) {
                    errors.lang_key = res.res.data.message
                    return reject(errors)
                }
            })
        }
    });
}

const validate = (values, props) => {
    const errors = {}
    if(!props.touched ) return errors;

    if (!values.lang_key) {
        errors.lang_key = '"Lang key" is not allowed to be empty'
    }
    if (!values.vi) {
        errors.vi = '"Tiếng việt" is not allowed to be empty'
    }
    if (!values.en) {
        errors.en = '"English" is not allowed to be empty'
    }
    if (!values.cn) {
        errors.cn = '"Chinese" is not allowed to be empty'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.formLanguage.values'),
        lang: _get(state, 'LanguageManageReducer.lang', {}),
        isFetching: _get(state, 'LanguageManageReducer.isFetching', false),
        formSaveStatus: _get(state, 'LanguageManageReducer.formSaveStatus', null),
        formSaveResponse: _get(state, 'LanguageManageReducer.formSaveResponse', {}),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getLanguageManage: () => dispatch(getLanguageManage()),
        saveLanguageManage: params => dispatch(saveLanguageManage(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    };
};

export default compose(
    reduxForm({
        form: 'formLanguage',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: ['lang_key']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(LanguageFormContainer);