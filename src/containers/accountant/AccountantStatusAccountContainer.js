import React, { Component } from 'react';
import { connect } from 'react-redux'

import { BankerAccountErrorContainer, BankerAccountEmptyContainer, BankerAccountProcessingContainer } from 'my-containers/accountant'
import { ModalDeleteAccountContainer, ModalFormAccountContainer } from 'my-containers/account'

class AccountantStatusAccountContainer extends Component {

    render() {
        return (
            <>
                <BankerAccountProcessingContainer />
                <div className="row">
                    <BankerAccountEmptyContainer />
                    <BankerAccountErrorContainer />
                </div>
                {/* Modal Area */}
                <ModalDeleteAccountContainer />
                <ModalFormAccountContainer formType="update" />
            </>
        );
    }
}

export default connect(null, null)(AccountantStatusAccountContainer);
