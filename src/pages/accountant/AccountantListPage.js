import React, { Component } from 'react';
import { connect } from 'react-redux'
import $ from 'jquery'
    
import { socketInitData, resetStore } from 'my-actions/AccountantAction';
import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantListBankerUtilContainer } from "my-containers/accountant"
import { SocketService } from 'my-utils/core';


class AccountantListPage extends Component {
    componentDidMount() {
        this.props.socketInitData()
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
                <div className="position-relative accountant-content">
                    <AccountantListBankerContainer />
                </div>
            </>
        );
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        socketInitData: _ => {dispatch(socketInitData())},
        resetStore: _ => {dispatch(resetStore())},
    }
};

export default connect(null, mapDispatchToProps)(AccountantListPage);