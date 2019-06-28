import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual, cloneDeep as _cloneDeep } from 'lodash'

import { checkBankerAccount } from 'my-actions/AccountantAction';

class AccountantItemBankerCheckboxContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        let newBanker = newProps.banker.find(item => item.id === newProps.bankerId)
        let oldBanker = this.props.banker.find(item => item.id === this.props.bankerId)
        //Pick field to compare
        if(!_isEqual(newBanker.checked, oldBanker.checked))
            return true
        return false
    }
    
    render() {
        const banker = this.props.banker.find(item => item.id === this.props.bankerId)
        if(_isEmpty(banker)) return null
        return (
            <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker", {bankerId: banker.id})} checked={banker.checked} />
        )
    }
}



const mapStateToProps = state => {
    return {
        banker : state.AccountantReducer.banker
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantItemBankerCheckboxContainer)