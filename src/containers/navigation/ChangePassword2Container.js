import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";
import { get as _get } from 'lodash';

import { FormWithReduxForm } from 'my-components/navigation';
import { savePassword2, toggleNotify } from 'my-actions/systems/ChangePasswordAction';

class ChangePassword2Container extends Component {
    data = [
        {
            name: 'current_password2',
            label: 'Current Password 2',
            type: 'password',
            rules: ['requiredCurrentPassword'],
        },
        {
            name: 'new_password2',
            label: 'New Password 2',
            type: 'password',
            rules: ['requiredNewPassword', 'notEqualCurrentPassword2', 'passwordValidNewPassword'],
        },
        {
            name: 're_new_password2',
            label: 'Confirm Password 2',
            type: 'password',
            rules: ['requiredConfirmPassword', 'confirmNewPassword2'],
        }
    ];

    handleSubmitForm = password => {
        this.props.savePassword2(password);
    };

    handleToggleNotify = _ => {
        this.props.toggleNotify(false);
    };

    render() {
        const { dataStore, t } = this.props;

        return (
            <FormWithReduxForm
                data={this.data}
                title="Change Password 2"
                onSubmitForm={this.handleSubmitForm}
                onToggleNotify={this.handleToggleNotify}
                isShowNotify={dataStore.isShowNotify}
                err={dataStore.errors || {}}
                success={{
                    status: dataStore.status || false,
                    msg: t('Change password successfully')
                }}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        dataStore: _get(state, 'ChangePasswordReducer', {}),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        savePassword2: (password) => dispatch(savePassword2(password)),
        toggleNotify: value => {dispatch(toggleNotify(value))},
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ChangePassword2Container);
