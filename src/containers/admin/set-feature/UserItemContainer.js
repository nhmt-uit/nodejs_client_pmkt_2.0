import React, {Component} from 'react';
import PropTypes from 'prop-types';

import { UserService } from 'my-services/user';

class UserItemContainer extends Component {
    static propTypes = { user: PropTypes.object };

    static defaultProps = { user: {} };

    state = {
        isLoadingExport: false,
        isLoadingReport: false,
        isReport: this.props.user.report_detail_feature,
        isExport: this.props.user.special_feature
    };

    handleToggle = e => {
        const { name, checked } = e.target;
        const formData = { id: this.props.user.id };
        const newState = {};

        if (name === 'export') {
            formData.special_feature = checked;

            newState.isLoadingExport = true;
            newState.isExport = checked;
        }

        if (name === 'report') {
            formData.report_detail_feature = checked;

            newState.isLoadingReport = true;
            newState.isReport = checked;
        }

        this.setState(newState, async () => {
            await UserService.toggleFeature(formData);

            const newState = {};

            if (name === 'export') newState.isLoadingExport = false;
            if (name === 'report') newState.isLoadingReport = false;

            this.setState(newState)
        })
    };

    render() {
        return (
            <tr>
                <td>{ this.props.user.username }</td>
                <td>
                    <label className="mt-checkbox margin-bottom-5">
                        <input type="checkbox" name="export" disabled={this.state.isLoadingExport} checked={this.state.isExport} onChange={this.handleToggle}/>&nbsp;
                        { this.state.isLoadingExport ? <i className="fa fa-spin fa-spinner" /> : null }
                        <span />
                    </label>
                </td>
                <td>
                    <label className="mt-checkbox margin-bottom-5">
                        <input type="checkbox" name="report" disabled={this.state.isLoadingReport} checked={this.state.isReport} onChange={this.handleToggle} />&nbsp;
                        { this.state.isLoadingReport ? <i className="fa fa-spin fa-spinner" /> : null }
                        <span />
                    </label>
                </td>
            </tr>
        );
    }
}

export default UserItemContainer;