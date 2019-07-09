import React, { Component } from 'react'
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';

import { TransComponent } from 'my-components';
import { BookTabContentContainer } from 'my-containers/account';
import { getTab } from 'my-actions/AccountAction';

class AccountListContainer extends Component {
    componentDidMount() {
        this.props.getTab();
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
                            lstTab.map(item => (
                                <li className="text-capitalize">
                                    <a href={`#${item.id}`} key={item.id} data-toggle="tab"><strong>{item.book_name}</strong></a>
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
                        <BookTabContentContainer id="all" isActive={true} data={{}} />
                        {
                            lstTab.map(item => (
                                <BookTabContentContainer id={item.id} data={{}} />
                            ))
                        }
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        lstTab: state.AccountReducer.lstTab || [],
    };
}

const mapDispatchToProps = dispatch => {
    return {
        getTab: () => dispatch(getTab()),
    };
}

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(AccountListContainer);
