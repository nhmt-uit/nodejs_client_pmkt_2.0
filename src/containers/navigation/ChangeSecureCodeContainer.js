import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { withTranslation } from "react-i18next";
import { get as _get } from 'lodash';

import { FormWithReduxForm } from 'my-components/navigation';
import { saveSecureCode, toggleNotify } from 'my-actions/systems/ChangeSecureCodeAction';

class ChangeSecureCodeContainer extends Component {
    data = [
        {
            name: 'current_secure',
            label: 'Current Secure',
            rules: ['required', 'number', 'maxLength6'],
        },
        {
            name: 'new_secure',
            label: 'New Secure',
            rules: ['required', 'number', 'maxLength6'],
        },
        {
            name: 're_new_secure',
            label: 'Confirm Secure',
            rules: ['required', 'confirmNewSecure'],
        }
    ];

    handleSubmitForm = secure => {
        this.props.saveSecureCode(secure);
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
                title="Change Secure Code"
                onSubmitForm={this.handleSubmitForm}
                onToggleNotify={this.handleToggleNotify}
                isShowNotify={dataStore.isShowNotify}
                onSubmit={this.handleSubmitForm}
                isReset={isReset}
                err={dataStore.errors || {}}
                success={{
                    status: dataStore.status || false,
                    msg: t('Change secure code successfully')
                }}
            />
        );
    }
}

const mapStateToProps = state => {
    return {
        dataStore: _get(state, 'ChangeSecureCodeReducer', {}),
    }
};

const mapDispatchToProps = dispatch => {
    return {
        saveSecureCode: (secure) => dispatch(saveSecureCode(secure)),
        toggleNotify: value => {dispatch(toggleNotify(value))},
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(ChangeSecureCodeContainer);
