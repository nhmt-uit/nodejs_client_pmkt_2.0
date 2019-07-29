import React, { Component } from 'react';
import { withRouter } from 'react-router-dom'
import { connect } from 'react-redux'
import { flashMessage } from 'redux-flash'
import { isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'
import { RoutesService } from 'my-routes';
import { toggleModalAccount, toggleModalDeleteAccount} from 'my-actions/AccountAction'
import { socketReloadBankerAccountInfo } from 'my-actions/AccountantAction'
import { deleteBankerAccount } from 'my-actions/AccountantAction';

class BankerAccountErrorContainer extends Component {
    state = {
        isDelete: false,
        isUpdate: false
    }
    checkItem = null

    shouldComponentUpdate(newProps, newState) {
        const bankerAccounts = this.props.bankerAccount.filter(item => ((item.type === "reject" && item.message !== "Empty data") || item.type === "stop"))
        const newPropsBankerAccounts = newProps.bankerAccount.filter(item => ((item.type === "reject" && item.message !== "Empty data") || item.type === "stop"))

        const isManualAccountatLostSession = newProps.bankerAccount.filter(item => item.type === "reject" && item.message === "Lost session please login again")

        const bankerName = this.props.match.params.bankerName
        if(!_isEmpty(isManualAccountatLostSession) && !_isEmpty(bankerName)) {
            this.props.flashMessage("Lost session please login again")
            this.props.history.push(RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { bankerName: bankerName, type: 'login' }))
        }

        if(!_isEqual(bankerAccounts, newPropsBankerAccounts)
            || !_isEqual(newState.isDelete, this.state.isDelete)
            || !_isEqual(newState.isUpdate, this.state.isUpdate)
            || !_isEqual(newProps.formAccountSaveStatus, this.props.formAccountSaveStatus)
            || !_isEqual(newProps.formAccountDeleteStatus, this.props.formAccountDeleteStatus)
            || !_isEqual(newProps.isOpenModal, this.props.isOpenModal)
            || !_isEqual(newProps.isOpenModalDelete, this.props.isOpenModalDelete)
            )
            return true
        return false;
    }

    componentWillReceiveProps() {
        const bankerAccounts = this.props.bankerAccount.filter(item => ((item.type === "reject" && item.message !== "Empty data") || item.type === "stop"))
        if (_isEmpty(bankerAccounts)) this.setState({isUpdate: false, isDelete: false})
    }

    componentDidUpdate() {
        if(this.props.formAccountSaveStatus === true) {
            this.props.socketReloadBankerAccountInfo({id: this.props.selectedItem.id})
        }
        if(this.props.formAccountDeleteStatus === true) {
            this.props.deleteBankerAccount(this.props.selectedItem)
        }
    }

    handleControl = type => {
        if (type === "delete") this.setState({isDelete: !this.state.isDelete, isUpdate: false})
        if (type === "edit") this.setState({isUpdate: !this.state.isUpdate, isDelete: false})
    }

    handelToggleModal = (e, item) => {
        this.checkItem = item.id
        if (this.state.isDelete) this.props.toggleModalDeleteAccount({selectedItem: item})
        if (this.state.isUpdate) this.props.toggleModalAccount({selectedItem: item})
        e.preventDefault()
    }
    
    renderBankerAccount(bankerAccounts) {
        this.checkItem = this.props.isOpenModal || this.props.isOpenModalDelete ? this.checkItem : null
        return bankerAccounts.map((item, idx) => {
            return (
                <div key={idx} className="form-group col-md-12" style={{marginBottom: '5px'}} >
                    <label className="mt-radio" onClick={e => this.handelToggleModal(e, item) } style={{marginBottom: '0px'}} >
                        {this.state.isUpdate || this.state.isDelete ? <input type="radio" name="optionsRadios" onChange={_ => null} checked={item.id === this.checkItem} /> : null }
                        <b className="uppercase">{item.acc_name} : </b>
                        {this.state.isUpdate || this.state.isDelete ? <span></span> : null}
                    </label>
                    <TransComponent i18nKey={item.message} />
                </div>
            )
        })
    }

    render() {
        const bankerAccounts = this.props.bankerAccount.filter(item => ((item.type === "reject" && item.message !== "Empty data") || item.type === "stop"))
        if (_isEmpty(bankerAccounts)) return false
        return (
            <div className="col-md-6 remove-when-reset">
                <div className="portlet box">
                    <div className="portlet-title bg-default">
                        <div className="caption"><TransComponent i18nKey="Error account" /></div>
                        <div className="tools">
                            <a href="#/" title="" onClick={_ => this.handleControl("edit")}>
                                {this.state.isUpdate ? <i className="fa fa-close"></i> : <i className="fa fa-pencil"></i> }
                            </a>
                            <a href="#/" title="" className="font-red-sunglo"  onClick={_ => this.handleControl("delete")}>
                                {this.state.isDelete ? <i className="fa fa-close"></i> : <i className="fa fa-trash"></i> }
                            </a>
                        </div>
                    </div>
                    <div className="portlet-body body-notify-acc-scan bg-danger">
                        <div className="row">
                            {this.renderBankerAccount(bankerAccounts)}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
        //Response Modal Account Saved
        formAccountSaveStatus: state.AccountReducer.formSaveStatus,
        formAccountDeleteStatus: state.AccountReducer.formDeleteStatus,
        selectedItem : state.AccountReducer.selectedItem,
        isOpenModal: state.AccountReducer.isOpenModal,
        isOpenModalDelete: state.AccountReducer.isOpenModalDelete,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        flashMessage: (message) => {dispatch(flashMessage(message))},
        // Socket Reload Account Info
        socketReloadBankerAccountInfo: (payload) => {dispatch(socketReloadBankerAccountInfo(payload))},
        // Handle Modal Form Account
        toggleModalAccount:  params => dispatch(toggleModalAccount(params)),
        // Handle Modal Delete Account
        toggleModalDeleteAccount:  params => dispatch(toggleModalDeleteAccount(params)),
        //Socket
        deleteBankerAccount: (params) => {dispatch(deleteBankerAccount(params))},
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(withRouter(BankerAccountErrorContainer))