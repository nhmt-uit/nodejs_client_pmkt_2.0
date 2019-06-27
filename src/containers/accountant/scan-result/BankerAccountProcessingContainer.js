import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual, cloneDeep as _cloneDeep, pick as _pick} from 'lodash'

import {BankerAccountProcessingItemContainer } from 'my-containers/accountant'

class BankerAccountProcessingContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        let oldBankerAccount = this.props.bankerAccount.filter(item => item.type === "notify")
        let newBankerAccount = newProps.bankerAccount.filter(item => item.type === "notify")
        // Pick field to compare
        if(!_isEqual(newBankerAccount, oldBankerAccount)) {
            newBankerAccount = newBankerAccount.map(item => ({type: item.type}))
            oldBankerAccount = oldBankerAccount.map(item => ({type: item.type}))
        }
        if(!_isEqual(oldBankerAccount, newBankerAccount))
            return true
        return false;
    }

    renderBankerAccount(bankerAccounts) {
        this.checkItem = this.props.isOpenModal ? this.checkItem : null
        return bankerAccounts.map((item, idx) => {
            return (
                <BankerAccountProcessingItemContainer  key={idx} bankerAccountId={item.id} />
            )
        })
    }

    render() {
        const bankerAccounts = this.props.bankerAccount.filter(item => item.type === "notify")
        if (_isEmpty(bankerAccounts)) return null
        return (
            <div className="note note-success row" style={{maxHeight: '400px', overflowY: 'auto'}}>
                {this.renderBankerAccount(bankerAccounts)}
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

export default connect(mapStateToProps, null)(BankerAccountProcessingContainer);