import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual} from 'lodash'

import { TransComponent } from 'my-components'

class BankerAccountEmptyContainer extends Component {
    state = {
        isDelete: false,
        isUpdate: false,
    }
    checkItem = null

    shouldComponentUpdate(newProps, newState) {
        const bankerAccounts = this.props.bankerAccount.filter(item => item.type === "reject" && item.message === "Empty data")
        const newPropsBankerAccounts = newProps.bankerAccount.filter(item => item.type === "reject" && item.message === "Empty data")

        if(!_isEqual(bankerAccounts, newPropsBankerAccounts)
            || !_isEqual(newState.isDelete, this.state.isDelete)
            || !_isEqual(newState.isUpdate, this.state.isUpdate)
            || !_isEqual(newProps.isOpenModal, this.props.isOpenModal)
            )
            return true
        return false;
    }



    componentWillReceiveProps() {
        const bankerAccounts = this.props.bankerAccount.filter(item => item.type === "reject" && item.message === "Empty data")
        if (_isEmpty(bankerAccounts)) this.setState({isUpdate: false, isDelete: false})
    }

    handleControl = type => {
        if (type === "delete") this.setState({isDelete: !this.state.isDelete, isUpdate: false})
        if (type === "edit") this.setState({isUpdate: !this.state.isUpdate, isDelete: false})
    }

    handelToggleModal = (item) => {
        if (this.state.isDelete) this.props.toggleModal('open_delete', item)
        if (this.state.isUpdate) this.props.toggleModal('open_update', item)
        this.forceUpdate()
    }
    
    renderBankerAccount(bankerAccounts) {
        this.checkItem = this.props.isOpenModal ? this.checkItem : null
        return bankerAccounts.map((item, idx) => {
            return (
                <div key={idx} className="form-group col-md-4" style={{marginBottom: '5px'}} >
                    <label className="mt-radio" onClick={_ => this.handelToggleModal(item) } style={{marginBottom: '0px'}} >
                        {this.state.isUpdate || this.state.isDelete ? <input type="radio" name="optionsRadios" onChange={_ => this.checkItem = item.id} checked={item.id === this.checkItem} /> : null }
                        <b className="uppercase">{item.acc_name}</b>
                        {this.state.isUpdate || this.state.isDelete ? <span></span> : null}
                    </label>
                </div>
            )
        })
    }

    render() {
        const bankerAccounts = this.props.bankerAccount.filter(item => item.type === "reject" && item.message === "Empty data")
        if (_isEmpty(bankerAccounts)) return false
        return (
            <div className="col-md-6">
                <div className="portlet box">
                    <div className="portlet-title bg-default">
                        <div className="caption"><TransComponent i18nKey="Empty data account" /></div>
                        <div className="tools">
                            <a href="#/" title="" onClick={_ => this.handleControl("edit")}>
                                {this.state.isUpdate ? <i className="fa fa-close"></i> : <i className="fa fa-pencil"></i> }
                            </a>
                            <a href="#/" title="" className="font-red-sunglo"  onClick={_ => this.handleControl("delete")}>
                                {this.state.isDelete ? <i className="fa fa-close"></i> : <i className="fa fa-trash"></i> }
                            </a>
                        </div>
                    </div>
                    <div className="portlet-body body-notify-acc-scan bg-success">
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
    }
}

export default connect(mapStateToProps, null)(BankerAccountEmptyContainer);