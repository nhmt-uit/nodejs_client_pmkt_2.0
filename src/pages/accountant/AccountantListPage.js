import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantListBankerUtilContainer } from "my-containers/accountant"
import { SocketService, EventsService } from 'my-utils/core';

class AccountantListPage extends Component {
    componentWillUnmount() {
        SocketService.disconnect()
    }

    render() {
        return (
            <>
                <AccountantFormScanContainer />
                <AccountantStatusAccountContainer />
                <AccountantListBankerUtilContainer />
                <AccountantListBankerContainer />
            </>
        );
    }
}

export default AccountantListPage;