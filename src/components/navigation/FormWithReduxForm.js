import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from "redux-form";
import { withTranslation } from "react-i18next";
import {
    get as _get,
    isEqual as _isEqual,
    find as _find,
} from 'lodash';

import { renderTextField } from 'my-utils/components/redux-form/render-ui-core'

const propTypes = {
    storeName: PropTypes.string,
    data: PropTypes.array,
    onSubmitForm: PropTypes.func,
    title: PropTypes.string,
};
const defaultProps = {
    data: [],
    onSubmitForm: () => void (0),
    title: '',
};
let DATA = [];

class FormWithReduxForm extends Component {
    constructor(props) {
        super(props);

        DATA = this.props.data;
    }

    handleSubmit() {
        return this.props.onSubmitForm(this.props.formValues);
    }

    renderForm() {
        const {data, t} = this.props;

        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className="form-body">
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
                                <Field key={index} {...props} index={index} component={renderTextField}/>
                            );
                        })
                    }
                    <div className="form-group">
                        <div className="col-md-offset-3 col-md-9">
                            <button type="submit" className="col-md-12 btn red">{t('Save')}</button>
                            &nbsp;&nbsp;
                        </div>
                    </div>
                </div>
            </form>
        );
    }

    render() {
        const t = this.props.t;

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

const validate = values => {
    const errors = {};

    console.log(DATA)

    Object.keys(values).forEach(name => {
        const objSelected = _find(DATA, (item) => item.name === name) || {};
        const rules = objSelected.rules || [];

        rules.forEach(rule => {
            const value = values[name];
            const label = objSelected.label || name;

            switch (rule) {
                case 'isRequired':
                    if (!value) {
                        errors[name] = `${label} is required`;
                    }
                    break;
                case 'passwordValid':
                    if (!(/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[!@#$%])[0-9A-Za-z!@#$%]{8,}$/).test(value)) {
                        errors[name] = `${label} is required at least 8 characters, included Uppercase, normal and special`;
                    }
                    break;
                case 'confirmPassword':
                    _get(objSelected, `confirm`, []).forEach(field => {
                        const objIndex = _find(DATA, (item) => item.name === name) || {};
                        if (_isEqual(value, values[field])) {
                            errors[name] = `${label} do not match ${objIndex.label || field}`;
                        }
                    });
            }
        })
    });

    console.log(errors);

    return errors;
};

FormWithReduxForm.propTypes = propTypes;
FormWithReduxForm.defaultProps = defaultProps;

const mapStateToProps = state => {
    return {
        formValues: _get(state, 'form.form_navigation.values', {}),
        dataFormValidation: _get(state, 'form_validation.data', []),
    }
};

export default compose(
    reduxForm({form: 'form_navigation', validate}),
    connect(mapStateToProps, null),
    withTranslation(),
)(FormWithReduxForm);