import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { get as _get, isEmpty as _isEmpty} from 'lodash'

import { TransComponent } from 'my-components'
import {  renderError } from 'my-utils/components/redux-form/render-form'

const optSubMemberNumber = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

class FormMemberContainer extends Component {

    componentWillMount() {
        this.props.initialize({...this.props.initialValues,
            username: 'av8896',
            s1: 1,
            s2: 0,
            s3: 5,
        })
    }

    handleSubmit = e => {
        console.log(this.props.initialValues)
    }
    

    render() {
        return (
            <form name="form_member">
                <div className="form-body">
                    {/* {this.renderAlert()} */}
                    <div className="form-group">
                        <label><TransComponent i18nKey="Full name" /></label>
                        <Field
                            name="fullname"
                            type="text"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                        />
                        <Field name="fullname"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Username" /></label>
                        <div className="row">
                            <div className="col-md-4" style={{paddingRight: '0px'}}>
                                <Field
                                    name="username"
                                    component="input"
                                    className="form-control form-control-solid placeholder-no-fix"
                                    autoComplete="off"
                                    readOnly={true}
                                />
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                <Field name="s1" component="select" className="form-control">
                                    {
                                        optSubMemberNumber.map(item => {
                                            return (<option value={item}>{item}</option>)
                                        })
                                    }
                                </Field>
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                <Field name="s2" component="select" className="form-control">
                                    {
                                        optSubMemberNumber.map(item => {
                                            return (<option value={item}>{item}</option>)
                                        })
                                    }
                                </Field>
                            </div>
                            <div className="col-md-2" style={{paddingRight: '0px'}}>
                                <Field name="s3" component="select" className="form-control">
                                    {
                                        optSubMemberNumber.map(item => {
                                            return (<option value={item}>{item}</option>)
                                        })
                                    }
                                </Field>
                            </div>
                        </div>
                        <Field name="username"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label class="mt-checkbox">
                            <Field
                                name="status"
                                type="checkbox"
                                component="input"
                                autoComplete="off"
                            /> <TransComponent i18nKey="Status" />
                            <span></span>
                        </label>
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="Password" /></label>
                        <Field
                            name="password"
                            type="password"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                        />
                        <Field name="password"component={renderError} />
                    </div>
                    <div className="form-group">
                        <label><TransComponent i18nKey="re-password" /></label>
                        <Field
                            name="re_password"
                            type="password"
                            component="input"
                            className="form-control form-control-solid placeholder-no-fix"
                            autoComplete="off"
                        />
                        <Field name="re_password"component={renderError} />
                    </div>
                    <div className="form-actions text-right">
                        <button type="button" className="btn red" disabled={this.props.invalid} onClick={this.handleSubmit}><TransComponent i18nKey="Save" /></button>
                    </div>
                </div>
            </form>
        );
    }
}

const validate = values => {
    const errors = {}
    if (!values.fullname) {
        errors.fullname = '"fullname" is not allowed to be empty'
    }
    if (!values.member) {
        errors.member = '"member" is not allowed to be empty'
    }
    return errors
}

const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_member.values'),
    }
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default compose(
    reduxForm({
        form: 'form_member',
        validate
    }),
    connect(mapStateToProps, mapDispatchToProps),
)(FormMemberContainer)
