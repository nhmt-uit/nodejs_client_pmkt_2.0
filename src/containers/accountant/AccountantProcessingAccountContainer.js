import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { get as _get, map as _map, isEmpty as _isEmpty} from 'lodash'

class AccountantProcessingAccountContainer extends Component {

    renderBankerAccount = _ => {
        const { t, full_payload, uuidBankerAccountMap, scanAccMap, payload_notify } = this.props
        let xhtml
        if(payload_notify) {
            xhtml = _map(payload_notify, (message, id) => {
                let bankerAccount = scanAccMap[id]
                return (
                    <span key={id} className="col-md-3"> <b class="uppercase">{bankerAccount.acc_name}</b> : {t(message)} </span>
                )
            })
        }

        return !_isEmpty(payload_notify) ? (<div className="note note-success row">{xhtml}</div>) : xhtml
    }

    render() {
        const { t, full_payload, uuidBankerAccountMap, scanAccMap } = this.props
        return (
            <>
                {this.renderBankerAccount()}
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        scanAccMap : _get(state, 'AccountantReducer.payload.scanAccMap', {}),
        uuidBankerAccountMap : state.AccountantScanReducer.uuidBankerAccountMap,
        full_payload : state.AccountantScanReducer.full_payload,
        payload_notify : state.AccountantScanReducer.payload_notify
    }
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(AccountantProcessingAccountContainer);