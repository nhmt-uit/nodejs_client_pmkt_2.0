import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { isEqual as _isEqual, map as _map, isEmpty as _isEmpty, sortBy as _sortBy, toArray as _toArray } from 'lodash'

import { socketScanData, socketStopScanData } from 'my-actions/AccountantAction';
import { TransComponent } from 'my-components'
import { RoutesService } from 'my-routes'
import { SocketService } from 'my-utils/core';
import { Helpers } from 'my-utils'
import BankerService from 'my-services/banker/BankerService'
import { CookieService } from 'my-utils/core';

class AccountantFormScanButtonContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.socketInitStatus, this.props.socketInitStatus)
            || !_isEqual(newProps.isProcessing, this.props.isProcessing)
            || !_isEqual(newProps.isAllowReport, this.props.isAllowReport)
            || !_isEqual(newProps.from_date, this.props.from_date)
            || !_isEqual(newProps.to_date, this.props.to_date)
            )
            return true
        return false;
    }

        /*
    |--------------------------------------------------------------------------
    | Call action to scan data
    |--------------------------------------------------------------------------
    */
    handleRequestScan = _ => {
        const bankerName = this.props.match.params.bankerName

        const filterBankerAccount = this.props.bankerAccount.filter(item => item.checked && item.type !== 'resolve' && !item.data)
        const ids = _map(filterBankerAccount, 'id')
        let objRequestScan = {ids: ids, from_date: this.props.from_date, to_date: this.props.to_date, filterBankerAccount: filterBankerAccount}
        if (!_isEmpty(ids)) {
            // Incase Accountant Manual
            if (!_isEmpty(bankerName)) {
                const objBanker = BankerService.getFlagType(bankerName)

                objRequestScan.bankerName = bankerName
                if(objBanker.account_role.length > 0) objRequestScan.accountRole = this.props.accountRole
                if(objBanker.flag_type.length > 0) objRequestScan.flagType = this.props.flagType
            }

            this.props.socketScanData(objRequestScan)
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Call action to save report
    |--------------------------------------------------------------------------
    */
    handleSaveReport = _ => {
        Helpers.showLoading()
        const payloadBankerAccount = this.props.bankerAccount.filter(item => item.type === 'resolve' && !_isEmpty(item.data.reportSave.reportSaveList))
        for(let x in payloadBankerAccount) {
            const requestObj = {
                from_date: payloadBankerAccount[x].data.from_date,
                to_date: payloadBankerAccount[x].data.to_date,
                dataReportSave: [payloadBankerAccount[x].data.reportSave]
            }
            SocketService.send('save_report', requestObj)
        }
        this.props.history.push(RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'))
    }

    /*
    |--------------------------------------------------------------------------
    | Cancel Scan Data
    |--------------------------------------------------------------------------
    */
    handleStopScan = _ => {
        let ids = _map(this.props.bankerAccount.filter(item => item.type === 'notify'), 'id')
        this.props.socketStopScanData({ids: ids})
    }

    /*
    |--------------------------------------------------------------------------
    | Handle Export Resolve Data
    |--------------------------------------------------------------------------
    */
    loopChild = (account, dataArray) => {
        dataArray.push(account);
        if (account.child.length > 0) {
            account.child.forEach( (childAccount) => {
                this.loopChild(childAccount, dataArray);
            })
        }
    }

    handleExportCsv = _ => {
        const username = CookieService.get('username');
        const bankerAccounts = this.props.bankerAccount.filter(item => item.type === "resolve")
        let bankerResults = []
        bankerAccounts.forEach(item => {
            const data = [];
            this.loopChild(item.data.accountant[0], data);
            
            const banker_name = this.props.banker.find(obj => obj.id === item.banker).name

            data.forEach(account => {
                account.reportAccountant.forEach(accountant => {
                    const reportData = accountant.reportData;
                    const acc_name = account.username;
                    const report_type = accountant.reportType;
                    const must = {};

                    must.banker_name = banker_name;
                    must.acc_name = acc_name;
                    must.report = report_type;

                    let header = ["turnover", "gross_comm", "net_turnover", "turnoverTT", "payout", "master_total", "member_comm", "win_loss", "company", "ma_total"];

                    if (username == 'av1202' && (banker_name.toLowerCase() == 'bong88' || banker_name.toLowerCase() == 'sbobet' || banker_name.toLowerCase() == '3in1bet' || banker_name.toLowerCase() == '332bet')) {
                        header = ["turnover", "gross_comm", "net_turnover", "turnoverTT", "payout", "master_total", "member_comm", "win_loss", "company", "ma_total", "outstanding"];
                    }

                    header.forEach(function (field) {
                        if (reportData[field]) {
                            must[field] = reportData[field];
                        } else {
                            must[field] = "";
                        }
                    });

                    bankerResults.push(must);

                });

            })
        })

        bankerResults = _sortBy(bankerResults, 'banker_name');

        let result, ctr, keys, columnDelimiter, lineDelimiter;

        if (bankerResults == null || !bankerResults.length) {
            return null;
        }

        columnDelimiter = ',';
        lineDelimiter = '\n';

        keys = Object.keys(bankerResults[0]);

        for (let i of bankerResults) {
            const keyArr = Object.keys(i);

            if (keyArr.length > keys.length) {
                keys = keyArr;
            }
        }

        for (let j of bankerResults) {
            const keyArr = Object.keys(j);

            for (let key of keyArr) {
                if (keys.indexOf(key) < 0) {
                    keys.splice(-4, 0, key);
                }
            }
        }

        result = '';
        result += keys.join(columnDelimiter);
        result += lineDelimiter;

        bankerResults.forEach(function(item) {
            ctr = 0;
            keys.forEach(function(key) {
                if (ctr > 0) result += columnDelimiter;

                if (item[key]) {
                    result += item[key];
                }

                ctr++;
            });
            result += lineDelimiter;
        });

        let blob = new Blob([result], {type: "text/csv;charset=utf-8;"});

        if (navigator.msSaveBlob) { // IE 10+
            navigator.msSaveBlob(blob, "export.csv")
        } else {
            let link = document.createElement("a");
            if (link.download !== undefined) {
                // feature detection, Browsers that support HTML5 download attribute
                let url = URL.createObjectURL(blob);
                link.setAttribute("href", url);
                link.setAttribute("download", "export.csv");
                // link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        }
    }

    render() {
        const hasSpecialFeature = Number(CookieService.get('hasSpecialFeature'));
        const { socketInitStatus, isProcessing, isAllowReport } = this.props
        const bankerName = this.props.match.params.bankerName

        if(socketInitStatus !== "finish") return null
        return (
            <div className="form-group">
                { !isProcessing ? <a href="#/" className="btn btn-default red" onClick={this.handleRequestScan}><TransComponent i18nKey="Scan" /></a> : null}
                { isProcessing ? <a href="#/" className="btn btn-default grey" onClick={this.handleStopScan}><TransComponent i18nKey="Stop" /></a> : null}
                { typeof bankerName === "undefined" && isAllowReport ? <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.handleSaveReport() }><TransComponent i18nKey="Save report" /></a> : null}
                { hasSpecialFeature === 1 && isAllowReport ? <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.handleExportCsv() }><TransComponent i18nKey="export to csv" /></a> : null}
                { bankerName ? <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { bankerName: bankerName, type: 'login' })} className="btn btn-default grey"><TransComponent i18nKey="Sign Out" /></Link> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        isProcessing : state.AccountantReducer.isProcessing,
        isAllowReport : state.AccountantReducer.isAllowReport,
        banker : state.AccountantReducer.banker,
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        socketScanData: params => {dispatch(socketScanData(params))},
        socketStopScanData: bankerAccount => {dispatch(socketStopScanData(bankerAccount))},
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(withRouter(AccountantFormScanButtonContainer));

