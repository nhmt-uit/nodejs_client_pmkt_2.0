import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'

import { collapseBankerAccount } from 'my-actions/AccountantAction';

class AccountantItemBankerAccountCollapseContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        //Prevent update when banker collapse
        let newBankerAccount = newProps.bankerAccount.find(item => item.id === newProps.bankerAccountId)
        let oldBankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        //Pick field to compare
        if(!_isEqual(newBankerAccount.data, oldBankerAccount.data)
            || !_isEqual(newBankerAccount.collapse, oldBankerAccount.collapse)
        )
            return true
        return false
    }
    
    render() {
        const bankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        if(_isEmpty(bankerAccount.data)) return null
        return (
            <label className="mt-checkbox" onClick={_ => this.props.collapseBankerAccount(bankerAccount.id)} style={{paddingLeft: '0px'}}>
                {bankerAccount.collapse ?  <i className="fa fa-minus"/> : <i className="fa fa-plus"/>}
            </label>
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
        collapseBankerAccount: (bankerAccountId) => {dispatch(collapseBankerAccount(bankerAccountId))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantItemBankerAccountCollapseContainer)