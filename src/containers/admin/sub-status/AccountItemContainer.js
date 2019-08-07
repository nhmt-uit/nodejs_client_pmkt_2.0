import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { isEqual as _isEqual } from 'lodash';
import { connect } from 'react-redux';

import { TransComponent } from 'my-components';
import { toggleModal, getSubActive, getSubLocked } from 'my-actions/sub-status/SubStatusAction';

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
        isToggle: false,
    };

    shouldComponentUpdate(nextProps, nextState, nextContext) {
        return !(_isEqual(nextState, this.state) && _isEqual(nextProps.account, this.props.account));
    }

    handleToggleChild = () => {
        if (this.state.isLoading) return ;

        if (this.state.isToggle) this.setState({ isToggle: false });
        else {
            this.setState({ isLoading: true }, async () => {
                if (this.props.isActive) await this.props.getSubActive(this.props.account);
                else await this.props.getSubLocked(this.props.account);

                this.setState({
                    isLoading: false,
                    isToggle: true
                })
            })
        }
    };

    renderChild() {
        if (!this.state.isToggle) return null;

        return (this.props.account.child || []).map((child, idx) => (
            <tr key={idx}>
                <td />
                <td><span className="margin-left-10">{ child.username }</span></td>
                <td>{ this.props.isActive ? <TransComponent i18nKey="Active" /> : <TransComponent i18nKey="InActive" /> }</td>
                <td className="text-center">
                    <i
                        onClick={() => this.props.toggleModal({ ...child, isActive: this.props.isActive, parent: this.props.account })}
                        className={`cursor-pointer font-green fa ${ this.props.isActive ? 'fa-lock' : 'fa-unlock' }`}
                    />
                </td>
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
                    <td className="text-center">
                        <i
                            onClick={() => this.props.toggleModal({ ...account, isActive })}
                            className={`font-size-15 cursor-pointer font-green fa ${ isActive ? 'fa-lock' : 'fa-unlock' }`}
                        />
                    </td>
                </tr>
                { this.renderChild() }
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleModal: selectedItem => dispatch(toggleModal(selectedItem)),
        getSubActive: formData => dispatch(getSubActive(formData)),
        getSubLocked: formData => dispatch(getSubLocked(formData)),
    };
};

export default connect(null, mapDispatchToProps)(AccountItemContainer);