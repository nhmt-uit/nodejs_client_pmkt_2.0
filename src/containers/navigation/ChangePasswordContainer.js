import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";
import { get as _get } from 'lodash';

import { FormWithReduxForm } from 'my-components/navigation';
import { savePassword, toggleNotify } from 'my-actions/systems/ChangePasswordAction';

class ChangePasswordContainer extends Component {
    data = [
        {
            name: 'pwd_current_password',
            label: 'Current Password',
            type: 'password',
            rules: ['requiredCurrentPassword'],
        },
        {
            name: 'pwd_new_password',
            label: 'New Password',
            type: 'password',
            rules: ['requiredNewPassword', 'passwordValidNewPassword', 'notEqualCurrentPassword'],
        },
        {
            name: 're_new_password',
            label: 'Confirm Password',
            type: 'password',
            rules: ['confirmNewPassword'],
        }
    ];

    handleSubmitForm = password => {
        this.props.savePassword(password);
    };

    handleToggleNotify = _ => {
        this.props.toggleNotify(false);
    };

    render() {
        const { dataStore, t } = this.props;
        const isReset = dataStore.status;

        return (
            <FormWithReduxForm
                data={this.data}
                title="Change Password"
                onSubmitForm={this.handleSubmitForm}
                onToggleNotify={this.handleToggleNotify}
                isShowNotify={dataStore.isShowNotify}
                isReset={isReset}
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
        savePassword: (password) => dispatch(savePassword(password)),
        toggleNotify: value => {dispatch(toggleNotify(value))},
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ChangePasswordContainer);
