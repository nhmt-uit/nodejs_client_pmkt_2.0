import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { withTranslation } from "react-i18next";
import $ from 'jquery';
import {
    get as _get,
    isEqual as _isEqual,
} from 'lodash';

import { renderTextField } from 'my-utils/components/redux-form/render-ui-core'

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

    rules = {
        required: value => value ? undefined : 'is required',
        passwordValid: value => (/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(value)
            ? undefined
            : 'is required at least 8 characters, included Uppercase, normal and special',
        confirmNewPassword: value =>
            _isEqual(value, _get(this.props, 'formValues.new_password', undefined))
                ? undefined
                : 'do not match new password',
        confirmNewPassword2: value =>
            _isEqual(value, _get(this.props, 'formValues.new_password2', undefined))
                ? undefined
                : 'do not match new password 2',
        confirmNewSecure: value =>
            _isEqual(value, _get(this.props, 'formValues.new_secure', undefined))
                ? undefined
                : 'do not match new secure code',
        notEqualCurrentPassword2: value =>
            _isEqual(value, _get(this.props, 'formValues.current_password2', undefined))
                ? 'must be different from current password 2'
                : undefined,
        maxLength6: value => value && ( value.length > 6 || value.length < 6) ? 'must be 6 characters' : undefined,
        number: value => value && isNaN(Number(value)) ? 'must be a number' : undefined
    };

    renderForm() {
        const {data, t, err, success, handleSubmit} = this.props;

        return (
            <form className="form-horizontal" onSubmit={handleSubmit(this.handleSubmit)}>
                <div className="form-body">
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <div className="alert alert-danger display-hide alert-err">
                                {
                                    err.status || false
                                        ? <span> {t(err.error_description || '')} </span>
                                        : null
                                }
                            </div>
                            <div className="alert alert-success display-hide alert-succ">
                                {
                                    success.status || false
                                        ? <span> {t(success.msg || '')} </span>
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
                                label: label || '',
                                ...otherProps,
                            };

                            return (
                                <Field
                                    key={index}
                                    {...props}
                                    index={index}
                                    component={renderTextField}
                                    validate={_get(item, 'rules', []).map(elm => this.rules[elm] )}
                                />
                            );
                        })
                    }
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <button disabled={_get(this.props, 'form.syncErrors', false)} type="submit" className="col-md-12 btn red">{t('Save')}</button>
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    render() {
        const { t, err, isShowNotify } = this.props;

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
                            <span className="caption-subject bold uppercase">{t(this.props.title)}</span>
                        </div>
                    </div>
                    <div className="portlet-body form">
                        <div style={{ width: '70%', margin: 'auto' }}>
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

const mapStateToProps = state => {
    return {
        formValues: _get(state, 'form.form_navigation.values', {}),
        form: _get(state, 'form.form_navigation', []),
    }
};

export default compose(
    reduxForm({
        form: 'form_navigation',
    }),
    connect(mapStateToProps, null),
    withTranslation(),
)(FormWithReduxForm)