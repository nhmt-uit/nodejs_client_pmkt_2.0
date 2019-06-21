import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { get as _get, map as _map, isEmpty as _isEmpty} from 'lodash'

import { BankerAccountErrorComponent, BankerAccountEmptyComponent, BankerAccountProcessingComponent } from 'my-components/accountant'

class AccountantStatusAccountContainer extends Component {
    /*
    |--------------------------------------------------------------------------
    | type: notify, reject
    | message: "Empty data"
    |--------------------------------------------------------------------------
    */
    generateData() {
        this.bankerAccountProcessing = []
        this.bankerAccountEmpty = []
        this.bankerAccountError = []
        const { scanAccMap, payloadBankerAccount } = this.props
        if(payloadBankerAccount) {
            _map(payloadBankerAccount, (item, idx) => {
                let bankerAccount = scanAccMap[item.id]
                let message = item.message
                item.acc_name = bankerAccount.acc_name
                switch (item.type) {
                    case "notify":
                        this.bankerAccountProcessing.push(item)
                    break
                    case "reject":
                    case "stop":
                        if (message === "Empty data") {
                            this.bankerAccountEmpty.push(item)
                        } else {
                            this.bankerAccountError.push(item)
                        }
                    break
                    default: break
                }
            })
        }
    }

    render() {
        this.generateData()
        return (
            <>
            <BankerAccountProcessingComponent bankerAccounts={this.bankerAccountProcessing} />
            <div className="row">
                <BankerAccountEmptyComponent bankerAccounts={this.bankerAccountEmpty} />
                <BankerAccountErrorComponent bankerAccounts={this.bankerAccountError} />
            </div>
            </>
        );
    }
}


const mapStateToProps = state => {
    return {
        scanAccMap : _get(state, 'AccountantReducer.payload.scanAccMap', {}),
        uuidBankerAccountMap : state.AccountantScanReducer.uuidBankerAccountMap,
        full_payload : state.AccountantScanReducer.full_payload,
        payloadBankerAccount : state.AccountantScanReducer.payloadBankerAccount
    }
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(AccountantStatusAccountContainer);
