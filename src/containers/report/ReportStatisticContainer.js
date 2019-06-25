import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    sortBy as _sortBy,
    toArray as _toArray
} from 'lodash';

import {
    getReport,
    getReportByBanker,
    getReportByMember
} from 'my-actions/ReportAction';
import { Helpers } from 'my-utils';
import { LoadingComponent } from 'my-components';
import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';

class ReportStatisticContainer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabReportActive: 'accounting',
            tabBookActive: -1,
        };
    }

    changeState = (obj, cb) => _ => {
        this.setState(
            obj,
            () => typeof cb === 'function' ? cb() : ''
        );
    };

    renderTabReport(type) {
        const t = this.props.t;
        const { currencyMap, totalAccounting, totalReport } = this.props.reportStore;
        const title = type === 'accounting' ? t('REPORT OF ACCOUNTING') : t('SYNTHESIS OF REPORT');
        const total = type === 'accounting' ? totalAccounting : totalReport;
        const className = type === 'accounting' ? 'tab-accountant' : 'tab-report';

        if (!currencyMap) {
            return (
                <a href={`#tab_${type}`} data-toggle="tab" className={className} >
                    <strong className="display-block font-red margin-bottom-5">{title}</strong>
                    <strong className="display-block font-size-12">USD: 0</strong>
                    <strong className="display-block font-size-12">VND: 0</strong>
                </a>
            );
        }

        return (
            <a href={`#tab_${type}`} onClick={this.changeState({ tabReportActive: type })} data-toggle="tab" className={className} >
                <strong className="display-block font-red margin-bottom-5">{title}</strong>
                {
                    currencyMap.map((item, index) => {
                        if (!totalAccounting || !totalAccounting[item.dv_tien_te_id]) {
                            return null;
                        }

                        return (
                            <strong key={index} className="display-block font-size-12">
                                {`${item.dv_tien_te}: ${Helpers.formatMoney(total[item.dv_tien_te_id].result, 0)}`}
                            </strong>
                        );
                    })
                }
            </a>
        );
    }

    renderBookTabs = () => {
        const roleMaster = CookieService.get('roles_master');
        const { tabReportActive } = this.state;
        const t = this.props.t;

        let books = this.props.reportStore.books || [];
        let bookElement = [];

        books = _sortBy(books, function (item) {
            if (item.book_name === 'sportsbook') {
                return -1;
            }

            if (item.book_name === 'other') {
                return 1;
            }

            return 0;
        }).reverse();

        if (tabReportActive === 'accounting') {
            if (Number(roleMaster) !== 1) {
                bookElement = books.map((item, index) => {
                    return <li key={index}>
                        <a className="text-capitalize" onClick={this.changeState({ tabBookActive: item.id })} href={`#tab_${tabReportActive}_${item.id}`} data-toggle="tab">{t(item.book_name)}</a>
                    </li>;
                })
            }
        } else {
            bookElement = [
                <li key={0}>
                    <a className="text-capitalize" onClick={this.changeState({ tabBookActive: 4 })} href={`#tab_${tabReportActive}_4`} data-toggle="tab">{t('Payment')}</a>
                </li>,
                <li key={1}>
                    <a className="text-capitalize" onClick={this.changeState({ tabBookActive: 3 })} href={`#tab_${tabReportActive}_3`} data-toggle="tab">{t('Other')}</a>
                </li>,
                <li key={2}>
                    <a className="text-capitalize" onClick={this.changeState({ tabBookActive: 2 })} href={`#tab_${tabReportActive}_2`} data-toggle="tab">{t('Old owing')}</a>
                </li>,
                <li key={3}>
                    <a className="text-capitalize" onClick={this.changeState({ tabBookActive: 1 })} href={`#tab_${tabReportActive}_1`} data-toggle="tab">{t('Accounting')}</a>
                </li>
            ];
        }

        return [
            ...bookElement,
            <li key={'all'} className="active">
                <a className="text-capitalize" onClick={this.changeState({ tabBookActive: -1 })} href={`#tab_${tabReportActive}_all`} data-toggle="tab">{t('All')}</a>
            </li>
        ];
    };

    renderBookTabContent = () => {
        const { books, data = {} } = this.props.reportStore;

        let accountingList = _sortBy(_toArray(data), 'name');

        accountingList = this.filterAccounting(accountingList);
        console.log(accountingList);

        return (
            <div className="tab-pane" id="tab_1_11">
                <div className="portlet-body">
                    Accountant report
                </div>
            </div>
        );
    };

    filterAccounting(accountingList) {
        const { tabReportActive, tabBookActive } = this.state;

        let result = null;

        if (tabReportActive === 'accounting') {
            result = accountingList.filter(item => {
                const currentItem = item.child.accounting;

                return !(tabBookActive !== -1 && !currentItem.child[tabBookActive]);
            });
        } else {
            result = accountingList.filter(item => {
                switch (tabBookActive) {
                    case 1:
                        return !!item.child.accounting;
                    case 2:
                        return !!item.child['Payment'];
                    case 3:
                        return !!item.child['Old owing'];
                    case 4:
                        return !!item.child['Other'];
                    default:
                        return true;
                }
            });
        }

        return result;
    }

    render() {
        const { currencyMap,isFetchingReport, itemActive } = this.props.reportStore;
        const t = this.props.t;
        const hasReportDetailFeature = Number(CookieService.get('hasReportDetailFeature'));

        if (isFetchingReport) {
            return (
                <div className="portlet light bordered">
                    <div className="portlet-body" style={{ minHeight: '60px' }}>
                        <LoadingComponent />
                    </div>
                </div>
            );
        }

        if (!currencyMap) {
            return null;
        }

        return (
            <div className="portlet light bordered">
                <div className="portlet-body ">
                    <div className="tabbable-line tabbable-full-width tabbable-report">
                        <ul className="nav nav-tabs">
                            <li className="active tab-report-detail">
                                { this.renderTabReport('accounting') }
                            </li>
                            <li className="tab-report-detail">
                                { this.renderTabReport('synthesis') }
                            </li>
                        </ul>
                        <div className="tab-content tab-report-content">
                            <div className="tab-pane active" id="tab_accounting">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tabbable-line tabbable-custom-profile">
                                            <ul className="nav nav-tabs tabs-reversed">
                                                <li className="title-accountant"><a href="javascript:;">{ itemActive.name || '' }</a></li>
                                                {
                                                    hasReportDetailFeature === 1
                                                        ? <li className="title-accountant">
                                                            <button
                                                                onClick={() => window.open(RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT_DETAIL', { chuky_id: itemActive.id }), '_blank')}
                                                                className="btn btn-danger btn-circle"
                                                            >
                                                                {t('Show detail')}
                                                            </button>
                                                        </li>
                                                        : ''
                                                }
                                                {this.renderBookTabs('accounting')}
                                            </ul>
                                            <div className="tab-content">
                                                <div className="tab-pane active" id="tab_1_11">
                                                    <div className="portlet-body">
                                                        Accountant report
                                                    </div>
                                                </div>
                                                {/*<div className="tab-pane" id="tab_1_22">*/}
                                                {/*    asd*/}
                                                {/*</div>*/}
                                                {this.renderBookTabContent()}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="tab-pane" id="tab_synthesis">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tabbable-line tabbable-custom-profile">
                                            <ul className="nav nav-tabs tabs-reversed">
                                                <li className="title-accountant">
                                                    <a href="javascript:;">{ itemActive.name || '' }</a>
                                                </li>
                                                {this.renderBookTabs('synthesis')}
                                            </ul>
                                            <div className="tab-content">
                                                <div className="tab-pane active" id="tab_1_11">
                                                    <div className="portlet-body">
                                                        Accountant report
                                                    </div>
                                                </div>
                                                <div className="tab-pane" id="tab_1_22">
                                                    asd
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        reportStore: state.ReportReducer || {},
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getReport: post => dispatch(getReport(post)),
        getReportByBanker: post => dispatch(getReportByBanker(post)),
        getReportByMember: post => dispatch(getReportByMember(post)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(ReportStatisticContainer);