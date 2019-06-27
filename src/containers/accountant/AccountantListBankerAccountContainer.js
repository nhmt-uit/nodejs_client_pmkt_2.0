import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual, cloneDeep as _cloneDeep, pick as _pick } from 'lodash'
import LazyLoad from 'react-lazyload';
import uuidv4 from 'uuid/v4'

import { AccountantItemBankerAccountContainer } from 'my-containers/accountant';

class AccountantListBankerAccountContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        let newBankerAccount = newProps.bankerAccount.filter(item => item.banker === newProps.bankerId)
        let oldBankerAccount = this.props.bankerAccount.filter(item => item.banker === this.props.bankerId)
        if(!_isEqual(newBankerAccount, oldBankerAccount)) {
            newBankerAccount = newBankerAccount.map(item => ({id: item.id}))
            oldBankerAccount = oldBankerAccount.map(item => ({id: item.id}))
        }

        
        if(!_isEqual(newBankerAccount, oldBankerAccount))
            return true
        return false
    }
    
    render() {
        const bankerAccounts = this.props.bankerAccount.filter(item => item.banker === this.props.bankerId)
        if(_isEmpty(bankerAccounts)) return null
        return bankerAccounts.map((item, idx) => {
            return (
                <AccountantItemBankerAccountContainer key={uuidv4()} bankerAccountId={item.id} />
            )
        })
    }
}



const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

export default connect(mapStateToProps, null)(AccountantListBankerAccountContainer)