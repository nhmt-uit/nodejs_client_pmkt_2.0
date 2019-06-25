import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { get as _get, map as _map, isEmpty as _isEmpty} from 'lodash'

import { BankerAccountErrorComponent, BankerAccountEmptyComponent, BankerAccountProcessingComponent } from 'my-components/accountant'
import { ModalDeleteAccountContainer, ModalFormAccountContainer } from 'my-containers/account'
import { deleteBankerAccount } from 'my-actions/AccountantAction';

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
        this.props.bankerAccount.map(item => {
            switch (item.type) {
                case "notify":
                    this.bankerAccountProcessing.push(item)
                break
                case "reject":
                case "stop":
                    if (item.message === "Empty data") {
                        this.bankerAccountEmpty.push(item)
                    } else {
                        this.bankerAccountError.push(item)
                    }
                break
                default: break
            }
        })
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
        this.props.deleteBankerAccount(item)
    }

    render() {
        this.generateData()
        return (
            <>
                <BankerAccountProcessingComponent bankerAccounts={this.bankerAccountProcessing} />
                <div className="row">
                    <BankerAccountEmptyComponent isOpenModal={this.state.isOpenModal} toggleModal={(type, bankerAccount) => this.toggleModal(type, bankerAccount)} bankerAccounts={this.bankerAccountEmpty} />
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
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        deleteBankerAccount: (params) => {dispatch(deleteBankerAccount(params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantStatusAccountContainer);
