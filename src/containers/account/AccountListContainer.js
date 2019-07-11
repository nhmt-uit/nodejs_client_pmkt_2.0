import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { sortBy as _sortBy } from 'lodash';

import { TransComponent, LoadingComponent } from 'my-components';
import { BookTabContentContainer } from 'my-containers/account';
import { getTab, getAccount } from 'my-actions/AccountAction';

class AccountListContainer extends Component {
    componentDidMount() {
        this.props.getTab();
        this.props.getAccount();
    }

    renderTabContent() {
        const { lstTab, isFetchingAccount } = this.props;

        let { lstAccount } = this.props;

        lstAccount = _sortBy(lstAccount, ['banker_name', 'acc_name']);

        if (isFetchingAccount) {
            return <div className="min-height-60 margin-top-15"><LoadingComponent /></div>;
        }  

        return (
            <>
                <BookTabContentContainer lstAccount={lstAccount} id="all" isActive={true} data={{}} />
                {
                    lstTab.map(item => (
                        <BookTabContentContainer lstAccount={lstAccount} key={item.id} id={item.id} data={{}} />
                    ))
                }
            </>
        );
    }

    render() {
        const { t, lstTab } = this.props;

        return (
            <div className="portlet box blue-hoki">
                <div className="portlet-title tabbable-line padding-top-0">
                    <div className="caption">
                        <span className="caption-subject bold uppercase font-size-15"><TransComponent i18nKey="Account list" /></span>
                    </div>
                    <ul className="nav nav-tabs">
                        <li className="text-capitalize active">
                            <a href="all" data-toggle="tab"><strong><TransComponent i18nKey="All" /></strong></a>
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
                            <i className="fa fa-search"></i>
                            <input className="form-control" onChange={e => void(0)} placeholder={t('member name')} type="text" />
                        </div>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="tab-content">
                        { this.renderTabContent() }
                    </div>
                </div>
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
    };
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(AccountListContainer);
