import React, { Component } from 'react';
import { connect } from 'react-redux'
    
import { socketInitData, resetWhenChangeDate } from 'my-actions/AccountantAction';
import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantListBankerUtilContainer } from "my-containers/accountant"
import { SocketService } from 'my-utils/core';

class AccountantListPage extends Component {
    componentDidMount() {
        this.props.socketInitData()
    }

    componentWillUnmount() {
        this.props.resetWhenChangeDate()
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
        socketInitData: _ => {dispatch(socketInitData())},
        resetWhenChangeDate: _ => {dispatch(resetWhenChangeDate())},
    }
};

export default connect(null, mapDispatchToProps)(AccountantListPage);