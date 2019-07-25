import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import {
    debounce as _debounce,
    sortBy as _sortBy,
    cloneDeep as _cloneDeep,
} from 'lodash';

import { TransComponent, LoadingComponent } from 'my-components';
import { BookTabContentContainer, ModalByActionContainer, LinkFormulaModalContainer } from 'my-containers/account';
import { getTab, getAccount, toggleModalAccount } from 'my-actions/AccountAction';

class AccountListContainer extends Component {
    componentDidMount() {
        this.props.getTab();

        if (!this.props.lstAccount.length) {
            this.props.getAccount();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.formSaveStatus && !prevProps.formSaveStatus) {
            this.props.getAccount();
        }
    }

    state = {
        isOpenModal: false,
        keySearch: '',
    };

    _mapLstAccount(lst, result = {}) {
        lst.forEach(item => {
            result[item.id] = item;

            if (item.child && item.child.length) return this._mapLstAccount(item.child, result);
        });

        return result;
    }

    filterAccountByBook(lstAccount, id) {
        const keySearch = this.state.keySearch.toLowerCase().trim();

        lstAccount = _cloneDeep(lstAccount);
        lstAccount = id === 'all' ? lstAccount : lstAccount.filter(account => account.book_id === id);

        if (keySearch) {
            lstAccount = lstAccount.filter( function findChild(item) {
                item.isOpen = true;

                if ((item.acc_name || '').toLowerCase().indexOf(keySearch) !== -1) {
                    item.isOpen = false;

                    return true;
                }

                if (item.child) return (item.child = item.child.filter(findChild)).length;

                return false;
            });
        }

        return lstAccount;
    }

    handleOpenCreateNewModal = () => this.props.toggleModalAccount();

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
                    lstTab.map((item, idx) => (
                        <BookTabContentContainer lstAccount={this.filterAccountByBook(lstAccount, item.id)} key={idx} id={item.id} data={{}} />
                    ))
                }
            </>
        );
    }

    render() {
        const { t, lstTab, isFetchingAccount } = this.props;

        return (
            <div className="portlet box blue-hoki position-relative min-height-60">
                { isFetchingAccount ? <LoadingComponent /> : null }
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
        formSaveStatus: state.AccountReducer.formSaveStatus || false,
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
