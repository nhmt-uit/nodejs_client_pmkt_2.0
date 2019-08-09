import React, {Component} from 'react'
import {Field, reduxForm} from "redux-form";
import { TransComponent } from 'my-components';
import {renderSelectField, renderError} from 'my-utils/components/redux-form/render-form'
import {connect} from "react-redux";
import {compose} from "redux/es/redux";
import {get as _get, isEmpty as _isEmpty} from "lodash";

import { getHostManage, saveHostManage, resetFormSaveResponse } from 'my-actions/host/HostManageAction'

class HostFormContainer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isEdit: false,
            onSubmit: true,
        }
    }

    componentWillMount() {
        this.props.getHostManage()
    }

    componentDidMount() {
        this.props.onRef(this)
    }

    componentWillUnmount() {
        this.props.onRef(undefined)
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.initialValues){
            var company = _get(nextProps.initialValues, 'company','');
            var host = _get(nextProps.initialValues, 'host','');
            if (company && host){
                this.setState({ onSubmit: false })
            } else {
            this.setState({ onSubmit: true })
            }
        }
    }

    callHostForm = item => {
        const {optBanker} = this.props
        this.setState({
            isEdit: true,
        })
        this.props.initialize({
            ...this.props.initialValues,
            host: _get(item, 'name', ''),
            company: optBanker.filter(obj => obj.value === item.banker_id),
            id: _get(item, 'id', ''),
        })
    }

    saveHostManage = (e) => {
        e.preventDefault();
        let id =  _get(this.props.initialValues, 'id','');
        let post = {};
        if(id){
            post = {
                host: _get(this.props.initialValues, 'host',''),
                company: _get(this.props.initialValues, 'company[0].value',''),
                id: id,
            }
        } else {
            post = {
                host: _get(this.props.initialValues, 'host',''),
                company: _get(this.props.initialValues, 'company.value',''),
            }
        }
        this.props.saveHostManage(post)
            .then( () => {
                this.props.getHostManage()
            })
            .then( () => {
                this.setState({
                    isEdit: false,
                })
                this.props.destroy('formHost')
            })
    }

    clickAddNew = () => {
        this.setState({
            isEdit: false,
            onSubmit: true,
        })
        this.props.destroy('formHost');
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
        const { bankerList } = this.props;
        const {isEdit, onSubmit} = this.state;
        var optBanker;
        if(!_isEmpty(bankerList)){
            optBanker = bankerList.map( item => {
                return {value: item.id, label: item.name.toUpperCase()}
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
                    <form role="form">
                        <div className="form-group">
                            <label><TransComponent i18nKey="Company"/></label>
                            <Field
                                name="company"
                                className="basic-single"
                                component={renderSelectField}
                                isSearchable={true}
                                options={optBanker}
                            />
                            <Field name="company" component={renderError}/>
                        </div>
                        <div className="form-group">
                            <label className="control-label"><TransComponent i18nKey="Host"/></label>
                            <Field className="form-control" component="input" name="host" type="text"/>
                            <Field name="host" component={renderError}/>
                        </div>
                        <div className="form-actions right">
                            {isEdit ?
                                <button className="btn green" onClick={this.clickAddNew}><TransComponent i18nKey="Add new"/></button> : null}
                            <button type="submit" className="btn red" disabled={onSubmit} onClick={this.saveHostManage}><TransComponent i18nKey="Save"/></button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.company) {
        errors.company = '"Company" is required'
    }
    if (!values.host) {
        errors.host = '"Host" is required'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.formHost.values'),
        bankerList: _get(state, 'HostManageReducer.bankerList', {}),
        optBanker: _get(state, 'HostManageReducer.optBanker', {}),
        formSaveStatus: _get(state, 'HostManageReducer.formSaveStatus', null),
        formSaveResponse: _get(state, 'HostManageReducer.formSaveResponse', {}),
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getHostManage: () => dispatch(getHostManage()),
        saveHostManage: params => dispatch(saveHostManage(params)),
        resetFormSaveResponse: params => dispatch(resetFormSaveResponse(params)),
    };
};

export default compose(
    reduxForm({
        form: 'formHost',
        validate,
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(HostFormContainer);