import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer } from "my-containers/accountant"
import { SocketService, EventsService } from 'my-utils/core';
// import AccountantQuickActivitiesContainer from "my-containers/accountant/AccountantQuickActivitiesContainer";

class AccountantListPage extends Component {
    componentWillUnmount() {
        SocketService.disconnect()
    }

    render() {
        return (
            <>
                <AccountantFormScanContainer />
                <AccountantStatusAccountContainer />
                {/* <AccountantQuickActivitiesContainer/> */}
                <AccountantListBankerContainer />
            </>
        );
    }
}

export default AccountantListPage;