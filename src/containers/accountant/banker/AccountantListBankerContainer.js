import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'
import uuidv4 from 'uuid/v4'

import { LoadingComponent } from 'my-components';
import { AccountanItemBankerContainer, ModalDeleteFormulaContainer, ModalFormFormulaContainer } from 'my-containers/accountant';

class AccountantListBankerContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        let newBankerAccount = newProps.banker
        let oldBankerAccount = this.props.banker

        if(!_isEqual(newBankerAccount, oldBankerAccount)) {
            newBankerAccount = newBankerAccount.map(item => ({id: item.id}))
            oldBankerAccount = oldBankerAccount.map(item => ({id: item.id}))
        }

        if(!_isEqual(newProps.socketInitStatus, this.props.socketInitStatus)
            || !_isEqual(oldBankerAccount, oldBankerAccount)
            )
            return true
        return false;
    }

    render() {
        if (this.props.socketInitStatus !== "finish" && _isEmpty(this.props.banker)) return <LoadingComponent />
        return (
            <>
            {
                this.props.banker.map((banker, idx) => {
                    return <AccountanItemBankerContainer  key={uuidv4()} bankerId={banker.id} />
                })
            }
            {/* Modal Delete Formular */}
            <ModalDeleteFormulaContainer />
            <ModalFormFormulaContainer />
            </>
        )
    }
}



const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        banker : state.AccountantReducer.banker
    }
}

export default connect(mapStateToProps, null)(AccountantListBankerContainer);