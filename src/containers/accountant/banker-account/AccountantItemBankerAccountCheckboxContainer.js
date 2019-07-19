import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'

import { checkBankerAccount } from 'my-actions/AccountantAction';

class AccountantItemBankerAccountCheckboxContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        let newBankerAccount = newProps.bankerAccount.find(item => item.id === newProps.bankerAccountId)
        let oldBankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        //Pick field to compare
        if(!_isEqual(newBankerAccount.checked, oldBankerAccount.checked))
            return true
        return false
    }
    
    render() {
        const bankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        if(_isEmpty(bankerAccount)) return null
        return (
            <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker_account", {bankerId: bankerAccount.banker, bankerAccountId: bankerAccount.id})}  checked={bankerAccount.checked} />
        )
    }
}



const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantItemBankerAccountCheckboxContainer)