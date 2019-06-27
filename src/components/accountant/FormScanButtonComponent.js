import React, { Component } from 'react'
import { compose } from 'redux'

import { TransComponent } from 'my-components'

class FormScanButtonComponent extends Component {

    render() {
        const { socketScanData, socketStopScanData, socketSaveReport, socketInitStatus, isProcessing, isAllowReport } = this.props
        if(socketInitStatus !== "finish") return false
        return (
            <div className="form-group">
                {!isProcessing ? <a href="#/" className="btn btn-default red" onClick={socketScanData}><TransComponent i18nKey="Scan" /></a> : null}
                {isProcessing ? <a href="#/" className="btn btn-default grey" onClick={socketStopScanData}><TransComponent i18nKey="Stop" /></a> : null}
                {/* <button type="submit" className="btn btn-default grey">{t("Sign Out")}</button> */}
                {isAllowReport ? <a href="#/" type="submit" className="btn btn-default red" onClick={socketSaveReport}><TransComponent i18nKey="Save report" /></a> : null}
                {isAllowReport ? <a href="#/" type="submit" className="btn btn-default red"><TransComponent i18nKey="export to csv" /></a> : null}
            </div>
        )
    }
}

export default FormScanButtonComponent