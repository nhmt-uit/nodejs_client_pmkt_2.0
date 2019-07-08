import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'


class BankerAccountProcessingItemContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        const bankerAccounts = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        const newPropsBankerAccounts = newProps.bankerAccount.find(item => item.id === newProps.bankerAccountId)

        if(!_isEqual(bankerAccounts.message, newPropsBankerAccounts.message))
            return true
        return false;
    }


    render() {
        const bankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        if (_isEmpty(bankerAccount)) return null
        return (
            <span className="col-md-3"> <b className="uppercase">{bankerAccount.acc_name}</b> : <TransComponent i18nKey={bankerAccount.message} /> </span>
        );
    }
}


const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

export default connect(mapStateToProps, null)(BankerAccountProcessingItemContainer);