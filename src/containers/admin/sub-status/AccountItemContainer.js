import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { get as _get } from 'lodash';
import { connect } from 'react-redux';

import { TransComponent } from 'my-components';
import { SubStatusService } from 'my-services/sub-status';
import { toggleModal } from 'my-actions/sub-status/SubStatusAction';

class AccountItemContainer extends Component {
    static propTypes = {
        account: PropTypes.object,
        order: PropTypes.number,
        isActive: PropTypes.bool,
    };

    static defaultProps = {
        account: {},
        order: null,
        isActive: false,
    };

    state = {
        isLoading: false,
        lstChild: [],
        isToggle: false,
    };

    handleToggleChild = () => {
        if (this.state.isLoading) return ;

        if (this.state.isToggle) this.setState({ isToggle: false, lstChild: [] });
        else {
            this.setState({ isLoading: true }, async () => {
                const result = await SubStatusService.getSubLocked({ id: this.props.account.id });

                if (result.status) {
                    this.setState({
                        lstChild: Array.isArray(_get(result, 'res.data')) ? _get(result, 'res.data') : [],
                        isLoading: false, isToggle: true
                    })
                } else {
                    this.setState({ lstChild: [], isLoading: false })
                }
            })
        }
    };

    renderChild() {
        return this.state.lstChild.map((child, idx) => (
            <tr key={idx}>
                <td />
                <td><span className="margin-left-10">{ child.username }</span></td>
                <td>{ this.props.isActive ? <TransComponent i18nKey="Active" /> : <TransComponent i18nKey="InActive" /> }</td>
                <td className="text-center"><i onClick={() => this.props.toggleModal(child)} className={`cursor-pointer font-green fa ${ this.props.isActive ? 'fa-lock' : 'fa-unlock' }`} /></td>
            </tr>
        ))
    }

    render() {
        const { account, order, isActive } = this.props;
        const icon = this.state.isLoading
            ? 'fa-spin fa-spinner'
            : this.state.isToggle
                ? 'fa-chevron-down'
                : 'fa-chevron-right';

        return (
            <>
                <tr>
                    <td>{ order }</td>
                    <td className="cursor-pointer" onClick={this.handleToggleChild}>
                        <i className={`fa ${icon} font-size-12`} />&nbsp;<span>{ account.username }</span>
                    </td>
                    <td/>
                    <td className="text-center"><i onClick={() => this.props.toggleModal(account)} className={`cursor-pointer font-green fa ${ isActive ? 'fa-lock' : 'fa-unlock' }`} /></td>
                </tr>
                { this.renderChild() }
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleModal: selectedItem => dispatch(toggleModal(selectedItem)),
    };
};

export default connect(null, mapDispatchToProps)(AccountItemContainer);