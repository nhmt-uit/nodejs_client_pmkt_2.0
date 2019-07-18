import React, { Component } from 'react'

import { TransComponent } from 'my-components'
import { AccountListContainer } from 'my-containers/account'

export default class AccountPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Account" /></div>
                </div>
                <div className="portlet-body">
                    <AccountListContainer />
                </div>
            </div>
        )
    }
}
