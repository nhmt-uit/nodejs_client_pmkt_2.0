import React, { Component } from 'react'
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'

class FormScanButtonComponent extends Component {

    render() {
        const { t, socketScanData } = this.props
        return (
            <div className="form-group">
                <a href="#/" type="submit" className="btn btn-default red" onClick={socketScanData}>{t("Scan")}</a>
                <button type="submit" className="btn btn-default grey">{t("Stop")}</button>
                <button type="submit" className="btn btn-default grey">{t("Sign Out")}</button>
                <button type="submit" className="btn btn-default red">{t("Save report")}</button>
                <button type="submit" className="btn btn-default red">{t("export to csv")}</button>
            </div>
        )
    }
}

export default compose(
    withTranslation()
)(FormScanButtonComponent)