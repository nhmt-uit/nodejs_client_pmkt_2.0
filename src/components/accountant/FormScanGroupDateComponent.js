import React, { Component } from 'react'
import { compose } from 'redux'
import { withTranslation } from 'react-i18next'

const groupDateType = [
    {value: 'today', label: 'Today'},
    {value: 'yesterday', label: 'Yesterday'},
    {value: 'this_week', label: 'This week'},
    {value: 'last_week', label: 'Last week'},
]


class FormScanGroupDateComponent extends Component {
    render() {
        const { t, changeGroupDate, typeGroupDate } = this.props
        const groupDateTypeXhtml = groupDateType.map((item, index) => {
            return (
                 <label key={index} className="mt-radio">
                     <input type="radio" name="optionsRadios" onChange={() => changeGroupDate(item.value)} checked={typeGroupDate === item.value} /> {t(item.label)}
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

export default compose(
    withTranslation()
)(FormScanGroupDateComponent)