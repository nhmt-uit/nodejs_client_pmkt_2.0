import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { debounce as _debounce, sortBy as _sortBy, cloneDeep as _cloneDeep } from 'lodash';

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

        const deleteIsOpen = lstAccount => {
            lstAccount.forEach(acc => {
                delete acc.isOpen;

                if (acc.child && acc.child.length) {
                    deleteIsOpen(acc.child);
                }
            })
        };

        const searchRecursive = (lstChild, lstAccName = []) => {
            return lstChild.some(item => {
                const accName = (item.acc_name || '').toLowerCase().trim();
                console.log('vao roi', accName);
                if (accName.indexOf(keySearch) !== -1) {
                    item.isOpen = true;

                    lstAccName.push(item.acc_name);

                    return true;
                }

                if (item.child && item.child.length) return searchRecursive(item.child, lstAccName);

                return false;
            });
        };

        let resultFilter = id === 'all' ? lstAccount : lstAccount.filter(account => account.book_id === id);

        if (keySearch) {
            deleteIsOpen(resultFilter);

            resultFilter.forEach(item => {
                const accName = (item.acc_name || '').toLowerCase().trim();

                if (accName.indexOf(keySearch) !== -1) {
                    result.push(item);

                    return;
                }

                if (item.child && item.child.length) {
                    const lstAccName = searchRecursive(item.child);

                    if (lstAccName) {
                        result.push(item);
                        // result.push(this.filterAccount(lstAccName));
                    }
                }
            });
        }

        return keySearch ? result : resultFilter;
    }

    filterAccount(account, level = 0, lstParent, hasAccount) {
        // if (account.isOpen && level === 0) {
        //     return account;
        // }
        //
        // if (!account.isOpen) {
        //     if (lstParent && level !== 0 && hasAccount) {
        //         lstParent.splice(lstParent.findIndex(item => item.id === account.id), 1);
        //     }
        //
        //     if (account.child && account.child.length) {
        //         const hasAccount = account.child.some(item => !!item.isOpen);
        //
        //         account.child.forEach(item => this.filterAccount(item, ++level, account.child, hasAccount));
        //     }
        // }
        //
        // return account;
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
