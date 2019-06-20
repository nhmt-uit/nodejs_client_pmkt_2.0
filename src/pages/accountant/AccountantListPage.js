import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantProcessingAccountContainer } from "my-containers/accountant"

class AccountantListPage extends Component {
    componentWillUnmount() {
        console.log("fired")
    }
    render() {
        return (
            <>
                <AccountantFormScanContainer />
                <AccountantProcessingAccountContainer />
                <AccountantStatusAccountContainer />
                <AccountantListBankerContainer />
            </>
        );
    }
}

export default AccountantListPage;