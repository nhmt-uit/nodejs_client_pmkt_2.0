import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";

import { FormWithReduxForm } from 'my-components/navigation';

class ChangePasswordContainer extends Component {
    data = [
        {
            name: 'current_password',
            label: 'Current Password',
            type: 'password',
            rules: ['isRequired'],
        },
        {
            name: 'new_password',
            label: 'New Password',
            type: 'password',
            rules: ['isRequired', 'passwordValid'],
        },
        {
            name: 're_new_password',
            label: 'Confirm Password',
            type: 'password',
            rules: ['isRequired', 'confirmPassword'],
            confirm: ['new_password'],
        }
    ];

    handleSubmitForm() {

    }

    render() {
        return (
            <FormWithReduxForm
                data={this.data}
                title="Change Password"
                onSubmitForm={this.handleSubmitForm.bind(this)}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
    }
};

const mapDispatchToProps = dispatch => {
    return {
    };
};


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ChangePasswordContainer);
