import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { isEmpty as _isEmpty } from 'lodash'
import LazyLoad from 'react-lazyload';

import { BankerAccountStatusIconComponent } from 'my-components/accountant';
import { checkBankerAccount } from 'my-actions/AccountantAction';
import { AccountantBankerAccountResultContainer } from 'my-containers/accountant';

class AccountantListBankerAccountContainer extends Component {
    render() {
        return this.props.bankerAccount.map((item, idx) => {
            if (item.banker !== this.props.bankerId) return false
            return (
                <div key={idx} className="panel-group accordion">
                    <div className="panel panel-default">
                        <div className="panel-heading">
                            <h4 className="panel-title">
                                <div className="col-sm-6">
                                    <label className="mt-checkbox uppercase">
                                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount("banker_account", {bankerId: item.banker, bankerAccountId: item.id})}  checked={item.checked} />
                                        {item.acc_name} <BankerAccountStatusIconComponent bankerAccountType={item.type} />
                                        <span></span>
                                    </label>
                                </div>
                                <div className="col-sm-6"><label className="mt-checkbox "> {item.note}</label></div>
                                <div className="clearfix"></div>
                            </h4>
                        </div>
                        { !_isEmpty(item.data) ? (
                            <LazyLoad>
                                <div className="panel-body bootstrap-table">
                                    <AccountantBankerAccountResultContainer payload={item.data}  />
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
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantListBankerAccountContainer);