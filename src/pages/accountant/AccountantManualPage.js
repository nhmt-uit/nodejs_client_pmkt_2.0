import React, { Component } from 'react';
import { connect } from 'react-redux'
import { withRouter } from 'react-router-dom'
    
import { socketInitData, resetStore } from 'my-actions/AccountantAction';
import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantListBankerUtilContainer } from "my-containers/accountant"
import { SocketService } from 'my-utils/core';

class AccountantManualPage extends Component {
    componentDidMount() {
        this.props.socketInitData({type: 'manual', bankerName: this.props.match.params.bankerName})
    }

    componentWillUnmount() {
        this.props.resetStore()
        SocketService.disconnect()
    }

    render() {
        return (
            <>
                <AccountantFormScanContainer />
                <AccountantStatusAccountContainer />
                <AccountantListBankerUtilContainer />
                <div className="position-relative">
                    <AccountantListBankerContainer />
                </div>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        socketInitData: params => {dispatch(socketInitData(params))},
        resetStore: _ => {dispatch(resetStore())},
    }
};

export default connect(null, mapDispatchToProps)(withRouter(AccountantManualPage));