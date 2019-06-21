import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { get as _get, map as _map, isEmpty as _isEmpty} from 'lodash'

import { BankerAccountErrorComponent, BankerAccountEmptyComponent, BankerAccountProcessingComponent } from 'my-components/accountant'
import { ModalDeleteAccountContainer, ModalFormAccountContainer } from 'my-containers/account'

class AccountantStatusAccountContainer extends Component {
    state = {
        typeModal: null,
        modal: false,
        selectedItem: null
    };
    /*
    |--------------------------------------------------------------------------
    | type: notify, reject
    | message: "Empty data"
    |--------------------------------------------------------------------------
    */
    generateData() {
        this.bankerAccountProcessing = []
        this.bankerAccountEmpty = []
        this.bankerAccountError = []
        const { scanAccMap, payloadBankerAccount } = this.props
        if(payloadBankerAccount) {
            _map(payloadBankerAccount, (item, idx) => {
                let bankerAccount = scanAccMap[item.id]
                let message = item.message
                item.acc_name = bankerAccount.acc_name
                switch (item.type) {
                    case "notify":
                        this.bankerAccountProcessing.push(item)
                    break
                    case "reject":
                    case "stop":
                        if (message === "Empty data") {
                            this.bankerAccountEmpty.push(item)
                        } else {
                            this.bankerAccountError.push(item)
                        }
                    break
                    default: break
                }
            })
        }
    }

    toggleModal = (type, bankerAccount) => {
        let isOpenModal = !this.state.isOpenModal, typeModal = this.state.isOpenModal
        if (type === "open_delete") {
            isOpenModal = true
            typeModal = 'delete'
        }
        if (type === "open_update") {
            isOpenModal = true
            typeModal = 'update'
        }

        if (type === "close") isOpenModal = false
        
        this.setState({
            typeModal: typeModal,
            isOpenModal: isOpenModal,
            selectedItem: bankerAccount
        });
    }

    handleFinishDelete = item =>{
        console.log(item)
    }

    render() {
        this.generateData()
        console.log("render")
        return (
            <>
                <BankerAccountProcessingComponent bankerAccounts={this.bankerAccountProcessing} />
                <div className="row">
                    <BankerAccountEmptyComponent isOpenModal={this.state.isOpenModal} toggleModal={this.toggleModal} bankerAccounts={this.bankerAccountEmpty} />
                    <BankerAccountErrorComponent isOpenModal={this.state.isOpenModal} toggleModal={(type, bankerAccount) => this.toggleModal(type, bankerAccount)} bankerAccounts={this.bankerAccountError} />
                </div>
                {/* Modal Area */}
                <ModalDeleteAccountContainer isOpen={this.state.typeModal === "delete" && this.state.isOpenModal} toggle={this.toggleModal} account={this.state.selectedItem} callback={this.handleFinishDelete} />
                <ModalFormAccountContainer isOpen={this.state.typeModal === "update" && this.state.isOpenModal} toggle={this.toggleModal} account={this.state.selectedItem} formType="update" />
            </>
        );
    }
}


const mapStateToProps = state => {
    return {
        scanAccMap : _get(state, 'AccountantReducer.payload.scanAccMap', {}),
        uuidBankerAccountMap : state.AccountantScanReducer.uuidBankerAccountMap,
        full_payload : state.AccountantScanReducer.full_payload,
        payloadBankerAccount : state.AccountantScanReducer.payloadBankerAccount
    }
}

export default compose(
    connect(mapStateToProps, null),
    withTranslation()
)(AccountantStatusAccountContainer);
