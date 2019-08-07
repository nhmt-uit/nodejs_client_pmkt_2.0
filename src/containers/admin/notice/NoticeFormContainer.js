import React, {Component} from 'react'
import {Field, reduxForm} from "redux-form";
import { TransComponent } from 'my-components';
import { renderError} from 'my-utils/components/redux-form/render-form'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";
import {get as _get, isEmpty as _isEmpty} from "lodash";
import { Editor } from '@tinymce/tinymce-react';

import { getNoticeManage } from 'my-actions/notice/NoticeManageAction'

class NoticeFormContainer extends Component {

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    callNoticeForm = item => {
        let typeOfNotice = [
            {value: "0", label: 'Normal'},
            {value: "1", label: 'Add'},
            {value: "2", label: 'Delete'},
        ]
        this.setState({
            isEdit: true,
        })
        this.props.initialize({
            ...this.props.initialValues,
            typeNotice: _get(typeOfNotice.filter(obj => Number(obj.value) === item.type), '[0]value',''),
            lang_key: _get(item, 'name', '').toUpperCase(),
            id: _get(item, 'id', ''),
        })
    }

    render() {
        const { allLang, lang } = this.props
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
                return(
                    <div className="form-group" key={item.id}>
                        <Editor
                            apiKey="uqulut3tdqs4596vhh0ne1etlut7lo75zcqwinu01z5f7k7k"
                            init={{ plugins: [
                                    'advlist autolink lists link image charmap print preview anchor textcolor',
                                    'searchreplace visualblocks code fullscreen',
                                    'insertdatetime media table paste code help wordcount'
                                ],
                                toolbar: 'undo redo | formatselect bold italic | alignleft aligncenter alignright alignjustify | bullist numlist |', }}
                        />
                    </div>
                )
            })
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject caption-subject font-green bold uppercase"><TransComponent i18nKey="Form"/></span>
                    </div>
                </div>
                <div className="portlet-body">
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
                            <Field className="form-control" component="input" name="lang_key" type="text"/>
                            <Field name="lang_key" component={renderError}/>
                        </div>
                        {langValue}
                        <div className="form-actions right">
                            {/*{isEdit ?*/}
                                {/*<button className="btn green" onClick={this.clickAddNew}><TransComponent i18nKey="Add new"/></button> : null}*/}
                            <button type="submit" className="btn red" disabled='' onClick={this.saveHostManage}><TransComponent i18nKey="Save"/></button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        allLang: _get(state, 'NoticeManageReducer.allLang', {}),
        lang: _get(state, 'NoticeManageReducer.lang', {}),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getNoticeManage: () => dispatch(getNoticeManage()),
    }
}

export default compose(
    reduxForm({
        form: 'formNotice',
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(NoticeFormContainer);