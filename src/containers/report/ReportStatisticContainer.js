import React, {Component} from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
    getReport,
    getReportByBanker,
    getReportByMember
} from 'my-actions/ReportAction';
import { Helpers } from 'my-utils';
import { LoadingComponent } from 'my-components';

class ReportStatisticContainer extends Component {
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
                                {`${item.dv_tien_te}: ${Helpers.sep1000(total[item.dv_tien_te_id].result, true)}`}
                            </strong>
                        );
                    })
                }
            </a>
        );
    }

    render() {
        const { currencyMap,isFetchingReport } = this.props.reportStore;

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
                            <div className="tab-pane active" id="tab_1_1">
                                <div className="row">
                                    <div className="col-md-12">
                                        <div className="tabbable-line tabbable-custom-profile">
                                            <ul className="nav nav-tabs tabs-reversed">
                                                <li className="title-accountant"><a href="">02/17/2019-02/23/2019</a></li>
                                                <li className="active">
                                                    <a href="#tab_1_11" data-toggle="tab"> All </a>
                                                </li>
                                                <li>
                                                    <a href="#tab_1_22" data-toggle="tab"> Sportsbook </a>
                                                </li>
                                                <li>
                                                    <a href="#tab_1_22" data-toggle="tab"> Casino </a>
                                                </li>
                                                <li>
                                                    <a href="#tab_1_22" data-toggle="tab"> Loto </a>
                                                </li>
                                                <li>
                                                    <a href="#tab_1_22" data-toggle="tab"> Other </a>
                                                </li>
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
                            <div className="tab-pane" id="tab_1_3">
                                Total accountant
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