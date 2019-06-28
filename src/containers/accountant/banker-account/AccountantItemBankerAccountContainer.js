import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'
import { isEmpty as _isEmpty, isEqual as _isEqual, cloneDeep as _cloneDeep, pick as _pick } from 'lodash'
import LazyLoad from 'react-lazyload';

import { collapseBankerAccount } from 'my-actions/AccountantAction';
import { AccountantBankerAccountResultContainer, AccountantItemBankerAccountCheckboxContainer, BankerAccountStatusIconContainer } from 'my-containers/accountant';

class AccountantItemBankerAccountContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        //Prevent update when banker collapse
        if(newProps.isCollapseBanker !== false) return false

        let newBankerAccount = newProps.bankerAccount.find(item => item.id === newProps.bankerAccountId)
        let oldBankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        //Pick field to compare
        if(!_isEqual(newBankerAccount.id, oldBankerAccount.id)
            || !_isEqual(newBankerAccount.collapse, oldBankerAccount.collapse)
            || !_isEqual(newBankerAccount.data, oldBankerAccount.data)
        )
            return true
        return false
    }
    
    render() {
        const bankerAccount = this.props.bankerAccount.find(item => item.id === this.props.bankerAccountId)
        if(_isEmpty(bankerAccount)) return null
        
        return (
            <div className="panel-group accordion">
                <div className="panel panel-default">
                    <div className="panel-heading">
                        <h4 className="panel-title">
                            <div className="col-sm-6">
                                <label className="mt-checkbox uppercase">
                                    <AccountantItemBankerAccountCheckboxContainer bankerAccountId={bankerAccount.id} />
                                    {bankerAccount.acc_name}
                                    <BankerAccountStatusIconContainer bankerAccountId={bankerAccount.id} />
                                    <span></span>
                                </label>
                            </div>
                            <div className="col-sm-5"><label className="mt-checkbox "> {bankerAccount.note}</label></div>
                            <div className="col-sm-1 text-right">
                            {bankerAccount.data ?
                                <label className="mt-checkbox" onClick={_ => this.props.collapseBankerAccount(bankerAccount.id)}>
                                    {bankerAccount.collapse ?  <i className="fa fa-minus"/> : <i className="fa fa-plus"/>}
                                </label>
                                : null }
                            </div>
                            <div className="clearfix"></div>
                        </h4>
                    </div>
                    <Collapse isOpen={bankerAccount.collapse}>
                        <AccountantBankerAccountResultContainer payload={bankerAccount.data} bankerAccountType={bankerAccount.type}  />
                    </Collapse>
                    {
                        // bankerAccount.collapse ?
                        //     (
                        //         // <LazyLoad>
                        
                        //         <AccountantBankerAccountResultContainer payload={bankerAccount.data} bankerAccountType={bankerAccount.type}  />
                        //         // </LazyLoad>
                        //     )
                        // : null
                    }
                    
                </div>
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        bankerAccount : state.AccountantReducer.bankerAccount,
        isCollapseBanker : state.AccountantReducer.isCollapseBanker,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBankerAccount: (bankerAccountId) => {dispatch(collapseBankerAccount(bankerAccountId))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantItemBankerAccountContainer)