import React, { Component } from 'react'
import { connect } from 'react-redux'
import { withRouter } from "react-router"
import { Link } from 'react-router-dom'
import { isEqual as _isEqual, map as _map, isEmpty as _isEmpty } from 'lodash'

import { socketScanData, socketStopScanData } from 'my-actions/AccountantAction';
import { TransComponent } from 'my-components'
import { RoutesService } from 'my-routes'
import { SocketService } from 'my-utils/core';
import { Helpers } from 'my-utils'
import BankerService from 'my-services/banker/BankerService'

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
        console.log(ids, filterBankerAccount)
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


    render() {
        const { socketInitStatus, isProcessing, isAllowReport } = this.props
        const bankerName = this.props.match.params.bankerName

        if(socketInitStatus !== "finish") return null
        return (
            <div className="form-group">
                { !isProcessing ? <a href="#/" className="btn btn-default red" onClick={this.handleRequestScan}><TransComponent i18nKey="Scan" /></a> : null}
                { isProcessing ? <a href="#/" className="btn btn-default grey" onClick={this.handleStopScan}><TransComponent i18nKey="Stop" /></a> : null}
                { bankerName ? <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { bankerName: bankerName, type: 'login' })} className="btn btn-default grey"><TransComponent i18nKey="Sign Out" /></Link> : null}
                { typeof bankerName === "undefined" && isAllowReport ? <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.handleSaveReport() }><TransComponent i18nKey="Save report" /></a> : null}
                { typeof bankerName === "undefined" && isAllowReport ? <a href="#/" type="submit" className="btn btn-default red"><TransComponent i18nKey="export to csv" /></a> : null}
            </div>
        )
    }
}

const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        isProcessing : state.AccountantReducer.isProcessing,
        isAllowReport : state.AccountantReducer.isAllowReport,
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

