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
        if (!_get(this.props, 'form.syncErrors', undefined)) {
            this.props.onSubmitForm(this.props.formValues);

            return this.props.reset();
        }
    };

    required = name => value => value ? undefined : <TransComponent i18nKey={`"${name}" is required`} /> ;
    requiredCurrentPassword = this.required('Current Password');
    requiredNewPassword = this.required('New Password');
    requiredConfirmPassword = this.required('Confirm password');
    requiredCurrentSecureCode = this.required('Current Security Code');
    requiredNewSecureCode = this.required('New Security Code');

    passwordValid = name => value => (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(value)
        ? undefined
        : <TransComponent i18nKey={`"${name}" fails to match the required pattern: /^(?=.*\\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%])[0-9a-za-z!@#$%]{{8,}}$/`} />;
    passwordValidNewPassword = this.passwordValid('new password');

    confirm = (name, refField) => value => _isEqual(value, _get(this.props, `formValues.${refField}`, undefined))
        ? undefined
        : <TransComponent i18nKey={`"${name}" must be one of [ref:${refField}]`} />;
    confirmSecureCode = this.confirm('Confirm Security Code', 'new_security_code');
    confirmNewPassword = this.confirm('Confirm password', 'new_password');
    confirmNewPassword2 = this.confirm('Confirm password', 'new_password2');

    numberSecureCode = value => value && isNaN(Number(value)) ? `"New Security Code" fails to match the required pattern: /^([0-9]){{6}}$/` : undefined;
    maxLength6SecureCode = value => value && ( value.length > 6 || value.length < 6) ? `"New Security Code" length must be at least 6 characters long` : undefined;

    notEqualCurrentPassword = value =>
        _isEqual(value, _get(this.props, 'formValues.current_password', undefined))
            ? <TransComponent i18nKey={`"new password" must not equal "current password"`} />
            : undefined;
    notEqualCurrentPassword2 = value =>
        _isEqual(value, _get(this.props, 'formValues.current_password2', undefined))
            ? <TransComponent i18nKey={`"new password" must not equal "current password"`} />
            : undefined;

    renderForm() {
        const {data, err, success, handleSubmit} = this.props;

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
                                <Field
                                    key={index}
                                    {...props}
                                    index={index}
                                    component={renderTextField}
                                    // validate={_get(item, 'rules', []).map(elm => this[elm] )}
                                />
                            );
                        })
                    }
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <button disabled={_get(this.props, 'form.syncErrors', false)} type="submit" className="col-md-12 btn red"><TransComponent i18nKey='Save' /></button>
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

    if (!values.pwd_current_password) errors.pwd_current_password = `"Current Password" ${msgRequired}`;
    if (!values.new_password) errors.new_password = `"New Password" ${msgRequired}`;
    if (!values.confirm_password) errors.confirm_password = `"Confirm password" ${msgRequired}`;
    if (!values.current_secure_code) errors.current_secure_code = `"Current Security Code" ${msgRequired}`;
    if (!values.new_secure_code) errors.new_secure_code = `"New Security Code" ${msgRequired}`;

    if (values.new_password && (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(values.new_password)) {
        errors.new_password = `"new password" fails to match the required pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[a-z])(?=.*[!@#$%])[0-9a-za-z!@#$%]{{8,}}$/`;
    }

    if (values.new_secure_code && values.current_secure_code && _isEqual(values.new_secure_code, values.current_secure_code)) {
        errors.new_security_code = `"Confirm Security Code" must be one of [ref:current_secure_code]`;
    }
    if (values.new_password && values.current_password && _isEqual(values.new_password, values.current_password)) {
        errors.new_security_code = `"Confirm password" must be one of [ref:new_password]`;
    }
    if (values.new_password2 && values.current_password2 && _isEqual(values.new_password2, values.current_password2)) {
        errors.new_security_code = `"Confirm password" must be one of [ref:new_password2]`;
    }

    if (values.new_secure_code && isNaN(Number(values.new_secure_code))) {
        errors.new_secure_code = `"New Security Code" fails to match the required pattern: /^([0-9]){{6}}$/`;
    }

    if (values.new_secure_code && ( values.new_secure_code.length > 6 || values.new_secure_code.length < 6 )) {
        errors.new_secure_code = `"New Security Code" length must be at least 6 characters long`;
    }

    if (values.new_password && values.current_password && _isEqual(values.new_password, values.current_password)) {
        errors.new_password = `"new password" must not equal "current password"`;
    }
    if (values.new_password && values.current_password2 && _isEqual(values.new_password, values.current_password2)) {
        errors.new_password = `"new password" must not equal "current password2"`;
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