import React, { Component } from 'react'

import BankerService from 'my-services/banker/BankerService'
import { TransComponent } from 'my-components'

class FormScanFlagTypeComponent extends Component {
    render() {
        const {bankerName, disabled, changeAccountRole, accountRole, changeFlagType, flagType} = this.props
        const objBanker = BankerService.getFlagType(bankerName)

        const flagTypeXhtml = objBanker.flag_type.map((item, index) => {
            return (
                <label key={index} className="mt-radio">
                    <input type="radio" name="flag_type" onChange={_ => changeFlagType(item.value)} checked={flagType === item.value} disabled={disabled} />
                    {item.label}
                    <span></span>
                </label>
            )
        })
        
        const accounRole = objBanker.account_role.map((item, index) => {
            return (
                <label key={index} className="mt-radio">
                    <input type="radio" name="account_role" onChange={_ => changeAccountRole(item.value)} checked={accountRole === item.value} disabled={disabled} />
                    {item.label}
                    <span></span>
                </label>
            )
        })
        // Choose account's role
        return (
            <>
                {objBanker.flag_type.length !== 0 ?
                    <div className="form-group">
                        <div className="mt-radio-inline">
                            {flagTypeXhtml}
                        </div>
                    </div>
                    : null
                }
                {objBanker.account_role.length !== 0 ?
                    <div className="form-group">
                    <TransComponent i18nKey="Choose account's role" />
                        <div className="mt-radio-inline">
                            {accounRole}
                        </div>
                    </div>
                    : null
                }
            </>
        )
    }
}

export default FormScanFlagTypeComponent