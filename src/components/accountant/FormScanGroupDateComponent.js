import React, { Component } from 'react'

import { TransComponent } from 'my-components'

const groupDateType = [
    {value: 'today', label: 'Today'},
    {value: 'yesterday', label: 'Yesterday'},
    {value: 'this_week', label: 'This week'},
    {value: 'last_week', label: 'Last week'},
]

class FormScanGroupDateComponent extends Component {
    render() {
        
        const { changeGroupDate, typeGroupDate, disabled } = this.props

        const groupDateTypeXhtml = groupDateType.map((item, index) => {
            return (
                <label key={index} className="mt-radio">
                    <input type="radio" name="optionsRadios" onChange={() => changeGroupDate(item.value)} checked={typeGroupDate === item.value} disabled={disabled} />
                    <TransComponent i18nKey={item.label} />
                    <span></span>
                </label>
            )
         })
        return (
            <div className="form-group">
                <div className="mt-radio-inline">
                    {groupDateTypeXhtml}
                </div>
            </div>
        )
    }
}

export default FormScanGroupDateComponent