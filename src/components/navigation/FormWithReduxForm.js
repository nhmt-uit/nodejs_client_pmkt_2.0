import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import $ from 'jquery';
import {
    get as _get,
    isEqual as _isEqual,
} from 'lodash';

import { renderTextField } from 'my-utils/components/redux-form/render-ui-core'
import { TransComponent } from 'my-components'

const propTypes = {
    storeName: PropTypes.string,
    data: PropTypes.array,
    onSubmitForm: PropTypes.func,
    title: PropTypes.string,
    err: PropTypes.object,
};
const defaultProps = {
    data: [],
    onSubmitForm: () => void (0),
    title: '',
};

class FormWithReduxForm extends Component {
    handleSubmit = _ => {
        this.props.onSubmitForm(this.props.formValues);

        return this.props.reset();
    };

    renderForm() {
        const {data, err, success, handleSubmit, form = {}} = this.props;
        const hasError = !form.syncErrors || Object.keys(form.registeredFields || {}).some(field => (form.syncErrors || {}).hasOwnProperty(field));

        return (
            <form className="form-horizontal" onSubmit={handleSubmit(this.handleSubmit)}>
                <div className="form-body">
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <div className="alert alert-danger display-hide alert-err">
                                {
                                    err.status || false
                                        ? <span> <TransComponent i18nKey= {err.error_description || ''} /> </span>
                                        : null
                                }
                            </div>
                            <div className="alert alert-success display-hide alert-succ">
                                {
                                    success.status || false
                                        ? <span> <TransComponent i18nKey= {success.msg || ''} /> </span>
                                        : null
                                }
                            </div>
                        </div>
                    </div>
                    {
                        data.map((item, index) => {
                            const {type, component, name, label, ...otherProps} = item;
                            const props = {
                                type: type || 'text',
                                component: component || 'input',
                                name: name || '',
                                label: <TransComponent i18nKey= {label}/> || '',
                                ...otherProps,
                            };

                            return (
                                <Field key={index}{...props} index={index} component={renderTextField} />
                            );
                        })
                    }
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <button disabled={hasError} type="submit" className="col-md-12 btn red"><TransComponent i18nKey='Save' /></button>
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    render() {
        const { err, isShowNotify } = this.props;

        if (isShowNotify) {
            const classVisible = err.status ? 'alert-err' : 'alert-succ';

            $(`div.${classVisible}`).fadeIn();

            setTimeout(() => {
                $(`div.${classVisible}`).fadeOut();

                this.props.onToggleNotify(false);
            }, 3000);
        }

        return (
            <div className="page-content-wrapper">
                <div className="portlet light bordered">
                    <div className="portlet-title">
                        <div className="caption font-red-sunglo">
                            <i className="icon-lock font-red-sunglo" />
                            <span className="caption-subject bold uppercase"><TransComponent i18nKey={this.props.title} /> </span>
                        </div>
                    </div>
                    <div className="portlet-body form">
                        <div className="max-width-650" style={{ margin: 'auto' }}>
                            {this.renderForm()}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

FormWithReduxForm.propTypes = propTypes;
FormWithReduxForm.defaultProps = defaultProps;

const validate = (values) => {
    const errors = {};
    const msgRequired = 'is required';

    if (!values.current_password) errors.current_password = `"Current Password" ${msgRequired}`;
    if (!values.current_password2) errors.current_password2 = `"Current Password" ${msgRequired}`;
    if (!values.current_secure) errors.current_secure = `"Current Security Code" ${msgRequired}`;
    else if (isNaN(Number(values.current_secure))) errors.current_secure = `"Current Security Code" must be a number`;

    if (!values.new_password) errors.new_password = `"New Password" ${msgRequired}`;
    else if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_password)) {
        errors.new_password = `"new password" fails to match the required pattern: /^(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%])[0-9a-za-z!@#$%]{{8,}}$/`;
    } else if (values.current_password && _isEqual(values.new_password, values.current_password)) {
        errors.new_password = `"new password" must not equal "current password"`;
    }

    if (!values.new_password2) errors.new_password2 = `"New Password" ${msgRequired}`;
    else if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_password2)) {
        errors.new_password2 = `"New Password" fails to match the required pattern: /^(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%])[0-9a-za-z!@#$%]{{8,}}$/`;
    } else if (values.current_password2 && _isEqual(values.new_password2, values.current_password2)) {
        errors.new_password2 = `"New Password" must not equal "Current Password"`;
    }

    if (!values.re_new_password)  errors.re_new_password = `"Confirm password" ${msgRequired}`;
    else if (values.new_password && !_isEqual(values.new_password, values.re_new_password)) {
        errors.re_new_password = `"Confirm password" must be one of [ref:new_password]`;
    }

    if (!values.re_new_password2)  errors.re_new_password2 = `"Confirm password" ${msgRequired}`;
    else if (values.new_password2 && !_isEqual(values.new_password2, values.re_new_password2)) {
        errors.re_new_password2 = `"Confirm password" must be one of [ref:new_password2]`;
    }

    if (!values.new_secure) errors.new_secure = `"New Security Code" ${msgRequired}`;
    else if (isNaN(Number(values.new_secure))) errors.new_secure = `"New Security Code" fails to match the required pattern: /^([0-9]){{6}}$/`;
    else if ((values.new_secure.length > 6 || values.new_secure.length < 6)) {
        errors.new_secure = `"New Security Code" length must be at least 6 characters long`;
    }

    if (!_isEqual(values.new_secure, values.re_new_secure)) {
        errors.re_new_secure = `"Confirm Security Code" must be one of [ref:new_security_code]`;
    }

    return errors;
};

const mapStateToProps = state => {
    return {
        formValues: _get(state, 'form.form_navigation.values', {}),
        form: _get(state, 'form.form_navigation', []),
    }
};

export default compose(
    reduxForm({ form: 'form_navigation', validate }),
    connect(mapStateToProps, null),
)(FormWithReduxForm)