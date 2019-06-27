import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual as _isEqual } from 'lodash'

class BankerAccountStatusIconContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        const bankerAccounts = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        const newPropsBankerAccounts = newProps.bankerAccount.find(item => item.id === newProps.bankerAccountId)

        if(!_isEqual(bankerAccounts.type, newPropsBankerAccounts.type))
            return true
        return false;
    }

    render() {
        const bankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        if(!bankerAccount.type) return null
        
        let xhtml
        switch (bankerAccount.type) {
            case "notify" :
                xhtml = <i className="fa fa-spinner font-yellow-soft spinner-animate" />
            break
            case "resolve" :
                xhtml = <i className="fa fa-check font-green-jungle" />
            break
            case "reject" :
            case "stop" :
                xhtml = <i className="fa fa-close font-red-pink" />
            break
            default: break
        }

        return (
            xhtml
        )
    }
}



const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

export default connect(mapStateToProps, null)(BankerAccountStatusIconContainer)
