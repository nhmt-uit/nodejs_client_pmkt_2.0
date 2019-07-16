import React, {Component} from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { get as _get } from 'lodash';

import { FormWithReduxForm } from 'my-components/navigation';
import { saveSecureCode, toggleNotify } from 'my-actions/systems/ChangeSecureCodeAction';
import { TransComponent } from 'my-components'

class ChangeSecureCodeContainer extends Component {
    data = [
        {
            name: 'current_secure',
            label: 'Current Security Code',
            rules: ['required', 'number', 'maxLength6'],
        },
        {
            name: 'new_secure',
            label: 'New Security Code',
            rules: ['required', 'number', 'maxLength6'],
        },
        {
            name: 're_new_secure',
            label: 'Confirm Security Code',
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
        const { dataStore } = this.props;
        const isReset = dataStore.status;

        return (
            <FormWithReduxForm
                data={this.data}
                title="Change Security Code"
                onSubmitForm={this.handleSubmitForm}
                onToggleNotify={this.handleToggleNotify}
                isShowNotify={dataStore.isShowNotify}
                onSubmit={this.handleSubmitForm}
                isReset={isReset}
                err={dataStore.errors || {}}
                success={{
                    status: dataStore.status || false,
                    msg: <TransComponent i18nKey="Change secure code successfully" />
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
)(ChangeSecureCodeContainer);
