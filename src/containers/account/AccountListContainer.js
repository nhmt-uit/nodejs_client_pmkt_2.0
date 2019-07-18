import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import {
    debounce as _debounce,
    sortBy as _sortBy,
    cloneDeep as _cloneDeep,
    isEmpty as _isEmpty
} from 'lodash';

import { TransComponent, LoadingComponent } from 'my-components';
import { BookTabContentContainer, ModalByActionContainer, LinkFormulaModalContainer } from 'my-containers/account';
import { getTab, getAccount, toggleModalAccount } from 'my-actions/AccountAction';

class AccountListContainer extends Component {
    componentDidMount() {
        this.props.getTab();
        this.props.getAccount();
    }

    state = {
        isOpenModal: false,
        keySearch: '',
    };

    filterAccountByBook(lstAccount, id) {
        const keySearch = this.state.keySearch.toLowerCase().trim();
        const result = [];
        lstAccount = _cloneDeep(lstAccount);
        lstAccount = lstAccount.filter( function findChild(item) {
            if (item.acc_name.includes(keySearch)) return true
            if (item.child) {
                return (item.child = item.child.filter(findChild)).length
            }
        })

        console.log(lstAccount)
        return lstAccount

        // const searchRecursive = (lstChild, lstAccMatch = {}, idParent) => {
        //     let isMatch = false;

        //     lstChild = _cloneDeep(lstChild);

        //     lstChild.forEach(item => {
        //         item = item || {};

        //         if (!item.acc_parent_id) idParent = item.id;

        //         const accName = (item.acc_name || '').toLowerCase().trim();

        //         if (accName.indexOf(keySearch) !== -1) {
        //             isMatch = true;

        //             lstAccMatch[idParent] = lstAccMatch[idParent] || [];
        //             lstAccMatch[idParent].push(item);
        //         }

        //         if (!isMatch && item.child && item.child.length) return searchRecursive(item.child, lstAccMatch, idParent);
        //     });

        //     return lstAccMatch;
        // };

        // let resultFilter = id === 'all' ? lstAccount : lstAccount.filter(account => account.book_id === id);

        // if (keySearch) {
        //     const lstAccMatch = searchRecursive(resultFilter);

        //     return Object.entries(lstAccMatch).map(acc => {
        //         const parentItem = resultFilter.find(item => item.id === acc[0]);

        //         return this.findParent(_cloneDeep(parentItem), acc[1], this._mapAccountList(_cloneDeep(resultFilter)));
        //     });
        // }

        // return keySearch ? result : resultFilter;
    }

    _mapAccountList(lstAccount) {
        const result = [];
        const loopAccount = (lstAccount) => {
            lstAccount.forEach(account => {
                result[account.id] = account;

                if (account.child && account.child.length) {
                    loopAccount(account.child);
                }
            })
        };

        loopAccount(lstAccount);

        return result;
    }

    findParent(parentItem, lstAccountMatch, lst) {
        let result = _cloneDeep(parentItem);

        const renderChild = (account, lstAcc, rsChild = {}) => {
            let accParent = lstAcc[account.acc_parent_id];

            if (!accParent.acc_parent_id) return rsChild;

            accParent.child = [account];
            rsChild = _cloneDeep(accParent);

            if (accParent.acc_parent_id) return renderChild(accParent, lstAcc, rsChild);
        };

        if (lstAccountMatch.every(item => item.id !== parentItem.id)) {
            result.child = [];

            lstAccountMatch.forEach(account => {
                if (account.id !== parentItem.id) {
                    result.child = result.child || [];

                    result.child.push(renderChild(account, lst));
                    console.log(result);
                }
            });
        }

        return lst[parentItem.id];
    }

    handleOpenCreateNewModal = () => {
        this.props.toggleModalAccount();
    };

    handleSearch = _debounce(key => {
        this.setState({ keySearch: key });
    }, 200);

    renderTabContent() {
        const { lstTab } = this.props;

        let { lstAccount } = this.props;

        lstAccount = _sortBy(lstAccount, ['banker_name', 'acc_name']);

        return (
            <>
                <BookTabContentContainer lstAccount={this.filterAccountByBook(lstAccount, 'all')} id="all" isActive={true} data={{}} />
                {
                    lstTab.map(item => (
                        <BookTabContentContainer lstAccount={this.filterAccountByBook(lstAccount, item.id)} key={item.id} id={item.id} data={{}} />
                    ))
                }
            </>
        );
    }

    render() {
        const { t, lstTab, isFetchingAccount } = this.props;

        return (
            <div className="portlet box blue-hoki position-relative">
                <button onClick={this.handleOpenCreateNewModal} className="btn btn-danger btn-add-formula"><TransComponent i18nKey="Add new" /></button>
                <div className="portlet-title tabbable-line padding-top-0">
                    <div className="caption">
                        <span className="caption-subject bold uppercase font-size-15"><TransComponent i18nKey="Account list" /></span>
                    </div>
                    <ul className="nav nav-tabs nav-tab-account">
                        <li className="text-capitalize active">
                            <a href="#all" data-toggle="tab"><strong><TransComponent i18nKey="All" /></strong></a>
                        </li>
                        {
                            lstTab.map((item) => (
                                <li key={item.id} className="text-capitalize">
                                    <a href={`#${item.id}`} data-toggle="tab"><strong>{item.book_name}</strong></a>
                                </li>
                            ))
                        }
                    </ul>
                    <div className="float-right padding-tb-6 margin-right-10">
                        <div className="input-icon right">
                            <i className="fa fa-search" />
                            <input className="form-control" onChange={e => this.handleSearch(e.target.value)} placeholder={t('member name')} type="text" />
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    { isFetchingAccount ? <LoadingComponent /> : null }
                    <div className="tab-content">
                        { this.renderTabContent() }
                    </div>
                </div>
                <ModalByActionContainer />
                <LinkFormulaModalContainer />
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lstTab: state.AccountReducer.lstTab || [],
        lstAccount: state.AccountReducer.lstAccount || [],
        isFetchingAccount: state.AccountReducer.isFetchingAccount || false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getTab: () => dispatch(getTab()),
        getAccount: () => dispatch(getAccount()),
        toggleModalAccount: () => dispatch(toggleModalAccount()),
    };
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(AccountListContainer);
