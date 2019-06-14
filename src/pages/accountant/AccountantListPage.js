import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer } from "my-containers/accountant"

class AccountantListPage extends Component {
    render() {
        return (
            <div>
                <AccountantFormScanContainer />
                <AccountantListBankerContainer />
            </div>
        );
    }
}

export default AccountantListPage;