import React, { Component } from 'react'
import { withTranslation } from 'react-i18next'

import { AccountService } from 'my-services/account'

class FormAccountContainer extends Component {
    componentWillMount() {
        AccountService.initForm(this.props.account.id)
    }
    
    handleSubmitForm = _ => {
        console.log("Submit Form")
        this.props.isSubmitSuccess("done")
    }

    render() {
        const { t, isSubmit } = this.props
        if(isSubmit) this.handleSubmitForm()
        

        return (
            <form role="form">
                <div className="form-body">
                    <div className="form-group">
                        <label><label>{t("Company")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Account name")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Belong to account")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Login User")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Sub password")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Secure code")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Note")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("The number of log")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Permission")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-group">
                        <label><label>{t("Is Active")}</label></label>
                        <input className="form-control" type="text" />
                    </div>
                    <div className="form-actions text-right">
                        <button type="submit" className="btn blue">{t("Save")}</button>
                        <button type="button" className="btn default">{t("Cancel")}</button>
                    </div>
                </div>
            </form>
        )
    }
}

export default withTranslation()(FormAccountContainer)