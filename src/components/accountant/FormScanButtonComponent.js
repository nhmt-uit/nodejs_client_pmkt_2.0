import React, { Component } from 'react'
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'

class FormScanButtonComponent extends Component {

    render() {
        const { t, socketScanData, socketStopScanData, socketSaveReport, isSocketInitSuccess, isProcessing, isAllowReport } = this.props
        if(!isSocketInitSuccess) return false
        return (
            <div className="form-group">
                {!isProcessing ? <a href="#/" className="btn btn-default red" onClick={socketScanData}>{t("Scan")}</a> : null}
                {isProcessing ? <a href="#/" className="btn btn-default grey" onClick={socketStopScanData}>{t("Stop")}</a> : null}
                {/* <button type="submit" className="btn btn-default grey">{t("Sign Out")}</button> */}
                {isAllowReport ? <a href="#/" type="submit" className="btn btn-default red" onClick={socketSaveReport}>{t("Save report")}</a> : null}
                {isAllowReport ? <a href="#/" type="submit" className="btn btn-default red">{t("export to csv")}</a> : null}
            </div>
        )
    }
}

export default compose(
    withTranslation()
)(FormScanButtonComponent)