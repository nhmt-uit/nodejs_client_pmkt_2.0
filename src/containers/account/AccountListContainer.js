import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { debounce as _debounce, sortBy as _sortBy } from 'lodash';

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

        const searchRecursive = (lstChild, flag, level) => {
            if (flag) {
                return true;
            }

            lstChild.forEach(item => {
                const accName = (item.acc_name || '').toLowerCase().trim();

                if (accName.indexOf(keySearch) !== -1) {
                    flag = true;
                }
            });

            return flag;
        };

        let results = id === 'all' ? lstAccount : lstAccount.filter(account => account.book_id === id);

        // if (keySearch) {
        //     results = results.filter(item => {
        //         const accName = (item.acc_name || '').toLowerCase().trim();
        //
        //         if (accName.indexOf(keySearch) !== -1) return true;
        //
        //         if (item.child && item.child.length) {
        //             return searchRecursive(item.child, false, ++level);
        //         }
        //
        //         return false;
        //     });
        // }

        return results;
    }

    handleOpenCreateNewModal = () => {
        this.props.toggleModalAccount();
    };

    handleSearch = _debounce(key => {
        this.setState({ keySearch: key });
    }, 300);

    renderTabContent() {
        const { lstTab, isFetchingAccount } = this.props;

        let { lstAccount } = this.props;

        lstAccount = _sortBy(lstAccount, ['banker_name', 'acc_name']);

        if (isFetchingAccount) {
            return <div className="min-height-60 margin-top-15"><LoadingComponent /></div>;
        }  

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
        const { t, lstTab } = this.props;

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
