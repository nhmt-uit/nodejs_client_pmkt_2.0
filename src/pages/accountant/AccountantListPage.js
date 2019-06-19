import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer } from "my-containers/accountant"

class AccountantListPage extends Component {
    render() {
        return (
            <>
                <AccountantFormScanContainer />
                <AccountantStatusAccountContainer />
                <AccountantListBankerContainer />
            </>
        );
    }
}

export default AccountantListPage;