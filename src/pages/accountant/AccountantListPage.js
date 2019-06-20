import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer } from "my-containers/accountant"
// import AccountantQuickActivitiesContainer from "my-containers/accountant/AccountantQuickActivitiesContainer";

class AccountantListPage extends Component {
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