import React, { Component } from 'react';

import { AccountantFormScanContainer, AccountantListBankerContainer, AccountantStatusAccountContainer, AccountantProcessingAccountContainer } from "my-containers/accountant"
import AccountantQuickActivitiesContainer from "../../containers/accountant/AccountantQuickActivitiesContainer";

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
                <AccountantQuickActivitiesContainer/>
                <AccountantListBankerContainer />
            </>
        );
    }
}

export default AccountantListPage;