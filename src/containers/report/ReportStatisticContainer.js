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

    books = [];

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
            <a href={`#tab_${type}`} data-toggle="tab" className={className} >
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

    renderBookTabs = (tabReportActive) => {
        const roleMaster = CookieService.get('roles_master');
        const t = this.props.t;

        let bookElement = [];

        this.books = this.props.reportStore.books || [];

        this.books = _sortBy(this.books, function (item) {
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
                bookElement = this.books.map((item, index) => {
                    return <li key={index}>
                        <a className="text-capitalize" href={`#tab_${tabReportActive}_${item.id}`} data-toggle="tab">{t(item.book_name)}</a>
                    </li>;
                })
            }
        } else {
            bookElement = [
                <li key={0}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_4`} data-toggle="tab">{t('Payment')}</a>
                </li>,
                <li key={1}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_3`} data-toggle="tab">{t('Other')}</a>
                </li>,
                <li key={2}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_2`} data-toggle="tab">{t('Old owing')}</a>
                </li>,
                <li key={3}>
                    <a className="text-capitalize" href={`#tab_${tabReportActive}_1`} data-toggle="tab">{t('Accounting')}</a>
                </li>
            ];
        }

        return [
            ...bookElement,
            <li key={'all'} className="active">
                <a className="text-capitalize" href={`#tab_${tabReportActive}_all`} data-toggle="tab">{t('All')}</a>
            </li>
        ];
    };

    renderBookTabContent = (type, id) => {
        const { data = {} } = this.props.reportStore;
        const t = this.props.t;

        let { currencyMap = [] } = this.props.reportStore;
        let accountingList = _sortBy(_toArray(data), 'name');

        accountingList = this.filterAccounting(accountingList, type, id);
        accountingList = this.parseAccountingToArray(accountingList, type);
        currencyMap = _sortBy(currencyMap, 'dv_tien_te').reverse();

        return (
            <div className="tab-pane" id={id} key={id}>
                <div className="portlet-body">
                    <table className="table table-hover table-light">
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
                                            &nbsp;{ abc }</td>
                                            {
                                                currencyMap.map((currency, i) => {
                                                    const value = elm.total[currency.dv_tien_te_id] || 0;
                                                    const className = Number(value) < 0 ? 'font-red' : 'font-blue-steel';

                                                    return <td className={className} key={i}>{Helpers.formatMoney(Number(value), 0)}</td>;
                                                })
                                            }
                                    </tr>)
                                });
                            })
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    };

    parseAccountingToArray(accountingList, tabReportActive) {
        const rs = {};
        const { tabBookActive } = this.state;
        const mapAccount = (data, id) => {
            data = _cloneDeep(data);

            const currentRs = { name: data.name, order: data.level, total: {} };

            if (data.level === 4) {
                currentRs.total[data.dv_tien_te_id] = data.result;
            } else if (data.level === 0 && tabReportActive === 'accounting') {
                Object.keys(_get(data, 'child.accounting.total', {})).forEach(elm => {
                    currentRs.total[elm] = data.child.accounting.total[elm].result;
                });
            } else {
                Object.keys(data.total).forEach(elm => {
                    currentRs.total[elm] = data.total[elm].result;
                });
            }

            rs[id] = rs[id] || [];
            rs[id].push(currentRs);

            if (data.child) {
                if (data.level === 0 && tabReportActive === 'accounting') {
                    if(data.child.accounting && data.child.accounting.child) {
                        if (tabBookActive === -1) {
                            Object.keys(data.child.accounting.child).forEach(elm => {
                                mapAccount(data.child.accounting.child[elm], id);
                            })
                        } else {
                            Object.keys(data.child.accounting.child[tabBookActive].child).forEach(elm => {
                                mapAccount(data.child.accounting.child[tabBookActive].child[elm], id);
                            })
                        }
                    } else {
                        delete rs[id];
                    }
                } else {
                    if (tabReportActive === 'synthesis' && data.level === 1) {

                    } else {
                        Object.keys(data.child).forEach(elm => {
                            mapAccount(data.child[elm], id);
                        })
                    }
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

                return !(tabBookActive !== -1 && !_get(currentItem, `child[${tabBookActive}]`, false));
            });
        } else {
            result = accountingList.filter(item => {
                switch (tabBookActive) {
                    case `tab_${tabReportActive}_1`:
                        return !!item.child.accounting;
                    case `tab_${tabReportActive}_2`:
                        return !!item.child['Old owing'];
                    case `tab_${tabReportActive}_3`:
                        return !!item.child['Other'];
                    case `tab_${tabReportActive}_4`:
                        return !!item.child['Payment'];
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
                                                { this.renderBookTabContent('accounting', "tab_accounting_all") }
                                                {
                                                    this.books.map(item => {
                                                        return this.renderBookTabContent('accounting', `tab_accounting_${item.id}`);
                                                    })
                                                }
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
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_all')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_1')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_2')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_3')}
                                                {this.renderBookTabContent('synthesis', 'tab_synthesis_4')}
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