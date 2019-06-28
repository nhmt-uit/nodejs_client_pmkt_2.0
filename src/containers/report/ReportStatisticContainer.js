import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import {
    sortBy as _sortBy,
    toArray as _toArray,
    cloneDeep as _cloneDeep,
    get as _get
} from 'lodash';

import { Helpers } from 'my-utils';
import { LoadingComponent, TransComponent } from 'my-components';
import { ReportByMember } from 'my-components/report';
import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';
import { isConditional } from 'babel-types';

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
        const { currencyMap, totalAccounting, totalReport, total } = this.props.reportStore;
        const title = type === 'accounting' ? t('REPORT OF ACCOUNTING') : t('SYNTHESIS OF REPORT');
        const totalTab = type === 'accounting' ? totalAccounting : type === 'member' ? total : totalReport;
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
            <a href={`#tab_${type}`} data-toggle="tab" className={className} >
                <strong className="display-block font-red margin-bottom-5">{title}</strong>
                {
                    currencyMap.map((item, index) => {
                        if (!totalTab || !totalTab[item.dv_tien_te_id]) {
                            return null;
                        }

                        return (
                            <strong key={index} className="display-block font-size-12">
                                {`${item.dv_tien_te}: ${Helpers.formatMoney(totalTab[item.dv_tien_te_id].result, 0)}`}
                            </strong>
                        );
                    })
                }
            </a>
        );
    }

    renderTabReportContent(type, isActive) {
        const classActive = isActive ? 'active' : '';
        const { itemActive = {}, books = [], reportType = 'cycle' } = this.props.reportStore;
        const t = this.props.t;
        const hasReportDetailFeature = Number(CookieService.get('hasReportDetailFeature'));
        const bookTabElm = type === 'accounting' ? this.renderBookTabs('accounting') : this.renderBookTabs('synthesis');

        return (
            <div className={`tab-pane ${classActive}`} id={`tab_${type}`}>
                <div className="row">
                    <div className="col-md-12">
                        <div className="tabbable-line tabbable-custom-profile">
                            <ul className="nav nav-tabs tabs-reversed">
                                <li className="title-accountant"><a href="javascript:;">{ itemActive.name || '' }</a></li>
                                {
                                    (type === 'accounting' && hasReportDetailFeature === 1)
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
                                {bookTabElm}
                            </ul>
                            <div className="tab-content">
                                {
                                    type === 'accounting'
                                        ? (
                                            <>
                                                { reportType === 'banker' ? this.renderBookTabContent('accounting', 'banker', true) : this.renderBookTabContent('accounting', -1, true) }
                                                {
                                                    books.map(item => this.renderBookTabContent('accounting', item.id))
                                                }
                                            </>
                                        )
                                        : (
                                            <>
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_all', true)}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_1')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_3')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_9')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_2')}
                                            </>
                                        )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    renderBookTabs = (tabReportActive) => {
        const roleMaster = CookieService.get('roles_master');
        const { t, reportStore } = this.props;
        const reportType = reportStore.reportType || 'cycle';

        let bookElement = [];

        let books = this.props.reportStore.books || [];

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
            if (reportType === 'banker') {
                bookElement = (
                    <li key={'other'} className="active">
                        <a className="text-capitalize" href="javascript:;" data-toggle="tab">{t('Other')}</a>
                    </li>
                );
            } else {
                bookElement = Number(roleMaster) !== 1 ? books.map((item, index) => {
                    return <li key={index}>
                        <a className="text-capitalize" href={`#${item.id}`} data-toggle="tab">{t(item.book_name)}</a>
                    </li>;
                }) : [];
    
                bookElement.push(
                    <li key={'all'} className="active">
                        <a className="text-capitalize" href={`#-1`} data-toggle="tab">{t('All')}</a>
                    </li>
                )
            }
        } else {
            bookElement = [
                <li key={0}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_2`} data-toggle="tab">{t('Payment')}</a>
                </li>,
                <li key={1}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_9`} data-toggle="tab">{t('Other')}</a>
                </li>,
                <li key={2}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_3`} data-toggle="tab">{t('Old owing')}</a>
                </li>,
                <li key={3}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_1`} data-toggle="tab">{t('Accounting')}</a>
                </li>,
                <li key={4} className="active">
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_all`} data-toggle="tab">{t('All')}</a>
                </li>
            ];
        }

        return bookElement;
    };

    renderBookTabContent = (type, id, isActive) => {
        const { data = {}, totalAccounting = {}, totalByBook = {}, totalByTypeReport = {}, totalReport = {} } = this.props.reportStore;
        const t = this.props.t;
        const classActive = isActive ? 'active' : '';

        let total = {}
        let { currencyMap = [] } = this.props.reportStore;
        let accountingList = _sortBy(_toArray(data), 'name');

        if (type === 'accounting') {
            total = id === -1 ? totalAccounting : (totalByBook[id] || []);
        } else {
            const bookId = id.split('_')[2] || '';
            total = id === 'tab_synthesis_all' ? totalReport : (totalByTypeReport[Number(bookId) === 1 ? 0 : bookId] || {})
        }

        accountingList = this.filterAccounting(accountingList, type, id);
        accountingList = this.parseAccountingToArray(accountingList, type, id);
        currencyMap = _sortBy(currencyMap, 'dv_tien_te').reverse();

        return (
            <div className={`tab-pane ${classActive}`} id={id} key={id}>
                <div className="portlet-body">
                    <table className="table table-striped table-bordered table-hover">
                        <thead className="font-red">
                            <tr>
                                <td><span className="glyphicon glyphicon-sort-by-alphabet" /></td>
                                <th className="font-red">{t('Member')}</th>
                                { currencyMap.map((item, index) => <th className="font-red" key={index}>{item.dv_tien_te}</th>) }
                                <th/>
                            </tr>
                        </thead>
                        <tbody>
                        {
                            Object.keys(accountingList).map((account, index) => {
                                const accountElm = accountingList[account];
                    
                                return accountElm.map((elm, ind) => {
                                    let childIcon = '';
                                    let abc = '';
                    
                                    for(let i = 0; i < elm.order; i++) {
                                        childIcon += '===';
                                    }
                    
                                    abc = `${childIcon}${elm.name}`;
                    
                                    return (<tr key={ind} className="cursor-pointer">
                                        <td>{ elm.order > 0 ? '' : index + 1 }</td>
                                        <td>
                                            {
                                                elm.order > 0
                                                    ? <span className="glyphicon glyphicon-chevron-right"/>
                                                    : <span className="glyphicon glyphicon-chevron-down"/>
                                            }
                                            &nbsp;{ abc }
                                        </td>
                                        {
                                            currencyMap.map((currency, i) => {
                                                const value = elm.total[currency.dv_tien_te_id] ?  elm.total[currency.dv_tien_te_id].result : 0;
                                                const className = Number(value) < 0 ? 'font-red' : 'font-blue-steel';
                
                                                return <td className={className} key={i}>{Helpers.formatMoney(Number(value), 0)}</td>;
                                            })
                                        }
                                        <td className="text-center">{ elm.deleteMoneyExchange ? <icon className="fa fa-close" /> : null }</td>
                                    </tr>)
                                });
                            })
                        }
                        </tbody>
                        <tfoot>
                            <tr>
                                <td />
                                <td><TransComponent i18nKey="Total" /></td>
                                {
                                    currencyMap.map(function (item, index) {
                                        const value = total && total[item.dv_tien_te_id] ? total[item.dv_tien_te_id].result : 0;
                                        const classCurrency = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                                        return <td className={classCurrency} key={index}>
                                            { Helpers.formatMoney(value, 0) }
                                        </td>
                                    })
                                }
                                <td/>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        );
    };

    parseAccountingToArray(accountingList, tabReportActive, tabBookActive) {
        const rs = {};
        const mapAccount = (data, id) => {
            data = _cloneDeep(data);

            const currentRs = { name: data.name, order: data.level, total: {} };

            let total = {};
            let deleteMoneyExchange = false;

            if (tabReportActive === 'accounting' && data.level !== 1 && data.level !== 0 && data.type_report && data.type_report === 4) {
                deleteMoneyExchange = true;
            }

            if (data.level === 0 && tabReportActive === 'accounting') {
                const childTotalAccounting = _get(data, 'child.accounting', {});

                deleteMoneyExchange = !!data.hasMoneyExchange;
                
                switch(tabBookActive) {
                    case 'banker' :
                        total = _get(childTotalAccounting, `child[${Object.keys(childTotalAccounting.child || {})[0]}].total`, {});
                        break;
                    case -1:
                        total = childTotalAccounting.total || {};
                        break;
                    default:
                        total = _get(childTotalAccounting, `child[${tabBookActive}].total`, {})
                }
            } else {
                total = data.total
                    ? data.total
                    : data.dv_tien_te_id
                        ? { [data.dv_tien_te_id]: { result: data.result } }
                        : {};
            }

            currentRs.total = total;
            currentRs.deleteMoneyExchange = deleteMoneyExchange;

            rs[id] = rs[id] || [];
            rs[id].push(currentRs);

            if (!data.child) {
                return;
            }

            const child = data.child;

            /*eslint-disable default-case*/
            switch(tabReportActive) {
                case 'accounting':
                    if (data.level === 0) {
                        if (!_get(child, 'accounting.child')) {
                            delete rs[id];

                            return;
                        }

                        const childAccountingByBanker = child.accounting.child[Object.keys(child.accounting.child)[0]];

                        if (tabBookActive === 'banker' && childAccountingByBanker.child) {
                            Object.keys(childAccountingByBanker.child).forEach(elm => {
                                mapAccount(childAccountingByBanker.child[elm], id);
                            });

                            return;
                        }

                        const childAccounting = tabBookActive === -1 ? child.accounting.child : child.accounting.child[tabBookActive].child;

                        Object.keys(childAccounting).forEach(elm => {
                            mapAccount(childAccounting[elm], id);
                        });

                        return;
                    }

                    Object.keys(child).forEach(elm => {
                        mapAccount(child[elm], id);
                    });

                    break;

                case 'synthesis':
                    const bookId = Number(tabBookActive.split('_')[2]) || '';

                    let childNext = child;

                    if (data.level === 0) {
                        switch (bookId) {
                            case 1:
                                childNext = _get(child, 'accounting.child', {});
                                break;
                            case 2:
                                childNext = _get(child, 'Payment.child', {});
                                break;
                            case 3:
                                childNext = _get(child, 'Old owing.child', {});
                                break;
                            case 4:
                                childNext = {};
                                break;
                            case 9:
                                childNext = _get(child, 'Other.child', {});
                                break;
                            default:
                                childNext = child;
                                break;
                        }

                        Object.keys(childNext).forEach(elm => {
                            mapAccount(childNext[elm], id);
                        })
                    }
            }
        };

        accountingList.forEach(item => {
            mapAccount(item, item.id);
        });

        return rs;
    }

    filterAccounting(accountingList, tabReportActive, tabBookActive) {
        let result = null;

        if (tabReportActive === 'accounting') {
            result = accountingList.filter(item => {
                const currentItem = item.child.accounting;

                return !(tabBookActive !== 'banker' && tabBookActive !== -1 && !_get(currentItem, `child[${tabBookActive}]`, false));
            });
        } else {
            result = accountingList.filter(item => {
                switch (tabBookActive) {
                    case `tab_${tabReportActive}_1`:
                        return !!item.child.accounting;
                    case `tab_${tabReportActive}_3`:
                        return !!item.child['Old owing'];
                    case `tab_${tabReportActive}_9`:
                        return !!item.child['Other'];
                    case `tab_${tabReportActive}_2`:
                        return !!item.child['Payment'];
                    default:
                        return true;
                }
            });
        }

        return result;
    }

    render() {
        const { currencyMap, isFetchingReport, reportType = 'cycle' } = this.props.reportStore;

        let tabContent = <></>;
        let tabReport = <></>;

        switch(reportType) {
            case 'cycle':
                tabContent = (
                    <>
                        {this.renderTabReportContent('accounting', true)}
                        {this.renderTabReportContent('synthesis')}
                    </>
                );

                tabReport = (
                    <>
                        <li className="active tab-report-detail">{ this.renderTabReport('accounting') }</li>
                        <li className="tab-report-detail">{ this.renderTabReport('synthesis') }</li>
                    </>
                );
                break;
            case 'banker':
                tabContent = this.renderTabReportContent('accounting', true);
                tabReport = <li className="active tab-report-detail">{ this.renderTabReport('accounting') }</li>;
                break;
            default:
                tabContent = <ReportByMember reportStore={this.props.reportStore} />
                tabReport = <li className="active tab-report-detail">{ this.renderTabReport('member') }</li>;
        }

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
                            { tabReport }
                        </ul>
                        <div className="tab-content tab-report-content">
                            { tabContent }
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

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(ReportStatisticContainer);