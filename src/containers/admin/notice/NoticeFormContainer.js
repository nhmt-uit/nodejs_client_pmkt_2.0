import React, {Component} from 'react'
import {Field, reduxForm} from "redux-form";
import { TransComponent, LoadingComponent } from 'my-components';
import { renderError} from 'my-utils/components/redux-form/render-form'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {get as _get, isEmpty as _isEmpty} from "lodash";
import { Editor } from '@tinymce/tinymce-react';

import { getNoticeManage, saveNoticeManage, resetFormSaveResponse } from 'my-actions/notice/NoticeManageAction'
import NoticeManageService from "../../../services/notice/NoticeManageService";

class NoticeFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: { vi: '', en: '', cn: '' },
            fieldSubmit: [],
            isEdit: false,
            submit: true,
        };
    }


    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    componentDidUpdate() {
        const { formSaveStatus } = this.props;
        if(formSaveStatus){
            this.props.getNoticeManage()
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.initialValues){
            var lang_key = nextProps.initialValues.lang_key;
            var type = nextProps.initialValues.typeNotice;
            if (lang_key && type !== undefined){
                this.setState({submit: false})
            } else { this.setState({ submit: true })}
        }
    }

    callNoticeForm = item => {
        var {fieldSubmit } = this.state;
        let typeOfNotice = [
            {value: "0", label: 'Normal'},
            {value: "1", label: 'Add'},
            {value: "2", label: 'Delete'},
        ];
        let content = { vi: '', en: '', cn: '' };
        this.props.initialize({
            ...this.props.initialValues,
            typeNotice: _get(typeOfNotice.filter(obj => Number(obj.value) === item.type), '[0]value',''),
            lang_key: _get(item, 'name', '').toUpperCase(),
            id: _get(item, 'id', ''),
        });
        fieldSubmit.forEach( itemLang => {
            item.child.forEach( itemChild => {
                if(itemChild.lang_code === itemLang){
                    content[itemLang] = itemChild.name;
                }
            })
        });

        this.setState({
            content: content,
            isEdit: true
        });
    };

    handleEditorChange  = (key, notice) => {
        var {content} = this.state
        content[key] = notice;
        this.setState({
            content: content
        })
    };

    saveHostManage = (e) => {
        e.preventDefault();
        const { fieldSubmit } = this.state;
        let id = _get(this.props.initialValues, 'id','');
        let post = {};
        if(id){ post['id'] = id}
        post['lang_key'] = _get(this.props.initialValues, 'lang_key','');
        post['type'] = _get(this.props.initialValues, 'typeNotice','');
        fieldSubmit.forEach( item => {
            post[item] = this.state.content[item];
        })
        this.props.saveNoticeManage(post)
            .then(
                this.props.destroy('formNotice')
            )
            .then(
                this.setState({
                    isEdit: false,
                    content: { vi: '', en: '', cn: '' },
                })
            )
    }

    clickAddNew = () => {
        this.setState({
            submit: true,
            isEdit: false,
            content: { vi: '', en: '', cn: '' },
        })
        this.props.destroy('formNotice');
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
        const { lang, isSaveLoading } = this.props;
        const { fieldSubmit, isEdit, submit, content } = this.state;
        let onSubmit = false;
        if(_isEmpty(content.vi) && _isEmpty(content.en) && _isEmpty(content.cn) ){ onSubmit = true }
        let langValue;
        let typeOfNotice = [
            {value: "0", label: 'Normal'},
            {value: "1", label: 'Add'},
            {value: "2", label: 'Delete'},
        ]

        let typeNotice = typeOfNotice.map(item => {
            return (
                <label key={item.value} className="mt-radio">
                    <Field
                        name="typeNotice"
                        component="input"
                        type="radio"
                        value={item.value}
                    />
                    {item.label}
                    <span></span>
                </label>
            )
        })

        if(!_isEmpty(lang)){
            langValue = lang.map( item => {
                if (fieldSubmit.indexOf(item.code) === -1) {
                    fieldSubmit.push(item.code);
                }
                return(
                    <div className="form-group" key={item.id}>
                        <label className="control-label bold"><TransComponent i18nKey={item.code + ':'}/></label>
                        <Editor
                            apiKey="uqulut3tdqs4596vhh0ne1etlut7lo75zcqwinu01z5f7k7k"
                            value={this.state.content[item.code]}
                            onEditorChange={this.handleEditorChange.bind(this, item.code)}
                            init={{ plugins: [
                                    'advlist autolink lists link image charmap print preview anchor textcolor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'bold italic backcolor | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | removeformat', }}
                        />
                    </div>
                )
            })
        }
        return (
            <div className="portlet light bordered">
                {this.renderAlert()}
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject caption-subject font-green bold uppercase"><TransComponent i18nKey="Form"/></span>
                    </div>
                </div>
                <div className="portlet-body">
                    {_isEmpty(lang) ? <LoadingComponent/> : null}
                    <form role="form">
                        <div className="form-group">
                            <label><TransComponent i18nKey="Type"/></label>
                            <div className="mt-radio-inline">
                                {typeNotice}
                                <Field name="typeNotice" component={renderError}/>
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label"><TransComponent i18nKey="lang_key"/></label>
                            <Field className="form-control" component="input" name="lang_key" type="text" disabled={isEdit}/>
                            <Field name="lang_key" component={renderError}/>
                        </div>
                        {langValue}
                        <div className="form-actions right">
                            {isEdit ?
                                <button className="btn green" onClick={this.clickAddNew}><TransComponent i18nKey="Add new"/></button> : null}
                            <button type="submit"
                                    className="btn red"
                                    disabled={this.props.invalid || submit || onSubmit}
                                    onClick={this.saveHostManage}>
                                <TransComponent i18nKey="Save"/>
                                { isSaveLoading ? <i className="fa fa-spinner fa-spin" /> : null }
                            </button>
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
            NoticeManageService.validateLangKey(values.lang_key).then(res => {
                if (res.status === false) {
                    errors.lang_key = res.res.data.message
                    return reject(errors)
                }
            })
        }
    });
}

const validate = (values) => {
    const errors = {}
    if (!values.lang_key) {
        errors.lang_key = '"Lang key" is not allowed to be empty'
    }
    if (!values.typeNotice) {
        errors.typeNotice = '"Type" is not allowed to be empty'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.formNotice.values'),
        allLang: _get(state, 'NoticeManageReducer.allLang', {}),
        lang: _get(state, 'NoticeManageReducer.lang', {}),
        formSaveStatus: _get(state, 'NoticeManageReducer.formSaveStatus', {}),
        formSaveResponse: _get(state, 'NoticeManageReducer.formSaveResponse', {}),
        isSaveLoading: _get(state, 'NoticeManageReducer.isSaveLoading', false)
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getNoticeManage: () => dispatch(getNoticeManage()),
        saveNoticeManage: params => dispatch(saveNoticeManage(params)),
        resetFormSaveResponse: () => dispatch(resetFormSaveResponse()),
    }
}

export default compose(
    reduxForm({
        form: 'formNotice',
        validate,
        asyncValidate: asyncValidate,
        asyncChangeFields: ['lang_key']
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(NoticeFormContainer);