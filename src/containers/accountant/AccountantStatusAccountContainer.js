import React, { Component } from 'react';
import { connect } from 'react-redux'
import { get as _get, map as _map, isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { BankerAccountErrorContainer, BankerAccountEmptyContainer, BankerAccountProcessingContainer } from 'my-containers/accountant'
import { ModalDeleteAccountContainer, ModalFormAccountContainer } from 'my-containers/account'
import { deleteBankerAccount } from 'my-actions/AccountantAction';

class AccountantStatusAccountContainer extends Component {
    state = {
        typeModal: null,
        modal: false,
        isOpenModal: false,
        selectedItem: null
    };

    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newState.typeModal, this.state.typeModal)
            || !_isEqual(newState.modal, this.state.modal)
            || !_isEqual(newState.selectedItem, this.state.selectedItem)
            || !_isEqual(newState.isOpenModal, this.state.isOpenModal)
            )
            return true
        return false;
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
        return (
            <>
                <BankerAccountProcessingContainer />
                <div className="row">
                    <BankerAccountEmptyContainer isOpenModal={this.state.isOpenModal} toggleModal={(type, bankerAccount) => this.toggleModal(type, bankerAccount)} />
                    <BankerAccountErrorContainer isOpenModal={this.state.isOpenModal} toggleModal={(type, bankerAccount) => this.toggleModal(type, bankerAccount)} />
                </div>
                {/* Modal Area */}
                <ModalDeleteAccountContainer isOpen={this.state.typeModal === "delete" && this.state.isOpenModal} toggle={this.toggleModal} account={this.state.selectedItem} callback={this.handleFinishDelete} />
                <ModalFormAccountContainer isOpen={this.state.typeModal === "update" && this.state.isOpenModal} toggle={this.toggleModal} account={this.state.selectedItem} formType="update" />
            </>
        );
    }
}



const mapDispatchToProps = (dispatch) => {
    return {
        deleteBankerAccount: (params) => {dispatch(deleteBankerAccount(params))},
    }
};

export default connect(null, mapDispatchToProps)(AccountantStatusAccountContainer);
