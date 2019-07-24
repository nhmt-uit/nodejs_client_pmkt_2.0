import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isEmpty as _isEmpty } from 'lodash';
import { connect } from 'react-redux';

import { TransComponent } from 'my-components';
import { ButtonCheckLoginContainer } from 'my-containers/account';
import { toggleModalAccount } from 'my-actions/AccountAction';

class AccountItemContainer extends Component {
    static propTypes = {
        account: PropTypes.object,
        isCheckLogin: PropTypes.bool,
        onChangeProps: PropTypes.func,
    };

    static defaultProps = {
        account: {},
        isCheckLogin: false,
        onChangeProps: () => void(0),
    };

    state = { 
        tooltipOpen: false,
        toggleIds: {},
        isOpenModalDelete: false,
    };

    toggleChildAccount = id => () => {
        const toggleIds = this.state.toggleIds;

        toggleIds[id] = !toggleIds[id];

        this.setState({ toggleIds });
    };

    handleOpenDeleteModal = (id, name) => () => this.props.onChangeProps({ deleteState: { id, name, isOpenModal: true } });

    handleOpenUpdateModal = selectedItem => () => this.props.toggleModalAccount({ selectedItem });

    handleOpenLinkFormulaModal = selectedItem => () => this.props.toggleModalAccount({ selectedItem, isModalLinkFormula: true });

    renderTR(item) {
        const toggleIds = this.state.toggleIds;
        const isOpen = toggleIds[item.id] !== undefined
            ? toggleIds[item.id]
            : !!item.isOpen;
        const iconChildToggle = (item.child && item.child.length)
            ? <i className={`fa ${ isOpen ? 'fa-chevron-down' : 'fa-chevron-right' }`} />
            : null;
        const marginLeft = item.__level ? { marginLeft: `${15*item.__level}px`} : {};
        const toggleChildEvt = (item.child && item.child.length) ? { onClick: this.toggleChildAccount(item.id) } : {};
        const cursorClass = (item.child && item.child.length) ? 'cursor-pointer' : '';

        return (
            <tr key={item.id}>
                <td>{!item.__level ?  item.__order : null}</td>
                <td className={"text-uppercase " + cursorClass} { ...toggleChildEvt }>
                    <span style={{ ...marginLeft }}>
                        <span style={{ marginLeft: `${10*item.__level}px` }}>{ item.__level ? item.__order : null }</span>
                        &nbsp;&nbsp;{ iconChildToggle }
                        &nbsp;{ item.acc_name }
                    </span>
                </td>
                <td>{ item.sub_user }</td>
                <td><span className="text-uppercase">{ item.banker_name || '' }</span></td>
                <td className="text-center">{
                    item.__level === 0 && item.sub_locked !== 0
                        ? (
                            <div className="wrap-tooltip">
                                <i className="fa fa-history icon-tooltip font-red cursor-pointer" />
                                <span className="tooltip-arrow hovered"/>
                                <span className="content-tooltip hovered bg-red-sunglo font-white tooltip-account">
                                    <TransComponent i18nKey="Tai khoan can cap nhat thong tin sub" />
                                </span>
                            </div>
                        )
                        : ''
                    }
                </td>
                <td className="text-center">
                    { item.__level === 0 ? <ButtonCheckLoginContainer isCheck={this.props.isCheckLogin} id={item.id} /> : null }
                </td>
                <td className="text-center">{(item.is_active || '').toString()}</td>
                <td className="text-center">
                    <i className="fa fa-plus-circle font-green cursor-pointer" onClick={this.handleOpenLinkFormulaModal(item)} />
                </td>
                <td className="text-center">
                    <i className="fa fa-edit font-green cursor-pointer" onClick={this.handleOpenUpdateModal(item)} />
                </td>
                <td className="text-center">
                    <i onClick={this.handleOpenDeleteModal(item.id, item.acc_name)} className="fa fa-times-circle font-red cursor-pointer" />
                </td>
            </tr>
        );
    }

    renderRecursiveItem(item) {
        const toggleIds = this.state.toggleIds;

        const result = [];
        const loopItem = (itemLoop) => {
            result.push(this.renderTR(itemLoop));

            const isOpen = toggleIds[itemLoop.id] !== undefined
                ? toggleIds[itemLoop.id]
                : !!itemLoop.isOpen;

            if (itemLoop.child && itemLoop.child.length && isOpen) itemLoop.child.forEach(child => loopItem(child));
        };

        if (!_isEmpty(item)) loopItem(item);

        return result;
    }

    render() {
        return this.renderRecursiveItem(this.props.account);
    }
}

const mapDispatchToProps = dispatch => {
    return {
        toggleModalAccount: params => dispatch(toggleModalAccount(params)),
    };
};

export default connect(null, mapDispatchToProps)(AccountItemContainer);
