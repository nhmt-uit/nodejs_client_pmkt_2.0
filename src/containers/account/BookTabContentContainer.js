import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { isPlainObject as _isPlainObject, merge as _merge } from 'lodash';
import {connect} from "react-redux";
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import { TransComponent } from 'my-components';
import { AccountItemContainer } from 'my-containers/account';
import { AccountService } from 'my-services/account';
import { getAccount, toggleModalAccount } from 'my-actions/AccountAction';

class BookTabContentContainer extends Component {
    static propTypes = {
        id: PropTypes.any.isRequired,
        isActive: PropTypes.bool,
        lstAccount: PropTypes.array,
    };

    static defaultProps = {
        isActive: false,
        lstAccount: [],
    };

    state = {
        isCheckLoginAll: false,
        deleteState: {
            isOpenModal: false,
            id: null,
            name: '',
            isLoading: false,
        },
    };

    handleChangeState = (state, cb) => () => {
        const oldState = this.state;

        Object.keys(state).forEach(key => {
            if (oldState.hasOwnProperty(key) && _isPlainObject(state[key])) {
                state[key] = _merge(oldState[key], state[key]);
            }
        });

        this.setState(state, () => {
            if (typeof cb === 'function') {
                cb();
            }
        })
    };
    
    handleDeleteAccount = () => {
        const { deleteState } = this.state;
        
        if (!deleteState.id) {
            return null;
        }

        deleteState.isLoading = true;

        return this.handleChangeState({ deleteState }, () => {
            return AccountService.deleteAccount(deleteState.id)
                .then(res => {
                    if (res.status) {
                        deleteState.isLoading = false;
                        deleteState.isOpenModal = false;

                        this.handleChangeState({ deleteState }, () => this.props.getAccount())()
                    } else {
                        deleteState.isLoading = false;

                        this.handleChangeState({ deleteState })()
                    }
                })
                .catch(() => {
                    deleteState.isLoading = false;

                    this.handleChangeState({ deleteState })()
                });
        })();
    };

    flatItem(item, level = 0, order = 1) {
        item.__level = level;
        item.__order = order;

        if (item.child && item.child.length) {
            const levelNext = ++level;

            item.child.forEach((child, index) => {
                this.flatItem(child, levelNext, index + 1);
            });
        }

        return item;
    }

    renderBody() {
        const { lstAccount } = this.props;

        return lstAccount.map((item, index) => 
            <AccountItemContainer
                key={index}
                isCheckLogin={this.state.isCheckLoginAll}
                account={this.flatItem(item, 0, index + 1)}
                onChangeProps={props => this.handleChangeState(props)()}
            />
        );
    }

    render() {
        const { id, isActive } = this.props;
        const { deleteState } = this.state;
        const classActive = isActive ? 'active' : '';

        return (
            <div className={`tab-pane ${classActive}`} id={id}>
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="font-red">
                            <tr className="font-red-sunglo">
                                <td><span className="glyphicon glyphicon-sort-by-alphabet" /></td>
                                <th><TransComponent i18nKey="Account name" /></th>
                                <th><TransComponent i18nKey="Login name" /></th>
                                <th><TransComponent i18nKey="Company" /></th>
                                <th>&nbsp;</th>
                                <th className="text-center">
                                    <TransComponent i18nKey="Test" />
                                    &nbsp;<i className="fa fa-recycle cursor-pointer" onClick={this.handleChangeState({ isCheckLoginAll: true })} />
                                </th>
                                <th className="text-center"><TransComponent i18nKey="is active" /></th>
                                <th className="text-center"><TransComponent i18nKey="Link formula" /></th>
                                <th className="text-center"><TransComponent i18nKey="Edit" /></th>
                                <th className="text-center"><TransComponent i18nKey="Delete" /></th>
                            </tr>
                        </thead>
                        <tbody>
                            { this.renderBody() }
                        </tbody>
                    </table>
                </div>
                <Modal isOpen={deleteState.isOpenModal} toggle={this.handleChangeState({ deleteState: { ...deleteState, isOpenModal: !deleteState.isOpenModal } })} >
                    <ModalHeader toggle={this.handleChangeState({ deleteState: { ...deleteState, isOpenModal: !deleteState.isOpenModal } })}><TransComponent i18nKey="xac nhan" /></ModalHeader>
                    <ModalBody><TransComponent i18nKey="are you sure delete" />&nbsp;<span className="text-uppercase">{deleteState.name}</span></ModalBody>
                    <ModalFooter>
                        <div className="text-center">
                            <button className="btn btn-primary" disabled={deleteState.isLoading} onClick={this.handleDeleteAccount}>
                                <TransComponent i18nKey="Delete" />{ deleteState.isLoading ? <i className="fa fa-spinner fa-spin" /> : null }
                            </button>&nbsp;
                            <button className="btn btn-danger" onClick={this.handleChangeState({ deleteState: { ...deleteState, isOpenModal: !deleteState.isOpenModal } })}>
                                <TransComponent i18nKey="Cancel" />
                            </button>
                        </div>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        getAccount: () => dispatch(getAccount()),
        toggleModalAccount: selectedItem => dispatch(toggleModalAccount(selectedItem)),
    };
};

export default connect(null, mapDispatchToProps)(BookTabContentContainer);
