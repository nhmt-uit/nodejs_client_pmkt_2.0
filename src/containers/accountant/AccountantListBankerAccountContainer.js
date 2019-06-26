import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'
import LazyLoad from 'react-lazyload';
import uuidv4 from 'uuid/v4'

import { BankerAccountStatusIconComponent } from 'my-components/accountant';
import { checkBankerAccount, collapseBankerAccount } from 'my-actions/AccountantAction';
import { AccountantBankerAccountResultContainer } from 'my-containers/accountant';

class AccountantListBankerAccountContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.bankerAccount.filter(item => item.banker === newProps.bankerId), this.props.bankerAccount.filter(item => item.banker === this.props.bankerId)))
            return true
        return false;
    }
    
    render() {
        return this.props.bankerAccount.map((item, idx) => {
            if (item.banker !== this.props.bankerId) return false
            return (
                <div key={uuidv4()} className="panel-group accordion">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <div className="col-sm-6">
                                    <label className="mt-checkbox uppercase">
                                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker_account", {bankerId: item.banker, bankerAccountId: item.id})}  checked={item.checked} />
                                        {item.acc_name} <BankerAccountStatusIconComponent bankerAccountId={item.id} bankerAccountType={item.type} />
                                        <span></span>
                                    </label>
                                </div>
                                <div className="col-sm-5"><label className="mt-checkbox "> {item.note}</label></div>
                                <div className="col-sm-1 text-right">
                                {item.data ?
                                    <label className="mt-checkbox" onClick={_ => this.props.collapseBankerAccount(item.id)}>
                                        {item.collapse ?  <i className="fa fa-plus"/> : <i className="fa fa-minus"/>}
                                    </label>
                                    : null }
                                </div>
                                <div className="clearfix"></div>
                            </h4>
                        </div>
                        { !_isEmpty(item.data) && item.collapse ? (
                            <LazyLoad>
                                <div className="panel-body bootstrap-table">
                                    <AccountantBankerAccountResultContainer payload={item.data} bankerAccountType={item.type} />
                                </div>
                            </LazyLoad>
                        ) : null }
                    </div>
                </div>
            )
        })
    }
}



const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
        collapseBankerAccount: (bankerAccountId) => {dispatch(collapseBankerAccount(bankerAccountId))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantListBankerAccountContainer)