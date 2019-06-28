import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Collapse } from 'reactstrap'
import { isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'
import uuidv4 from 'uuid/v4'

import { collapseBanker, checkBankerAccount } from 'my-actions/AccountantAction';
import { LoadingComponent } from 'my-components';
import { AccountantListBankerAccountContainer, AccountantItemBankerCheckboxContainer } from 'my-containers/accountant';


let isBankerCollapse = false
class AccountanItemBankerContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        let newBanker = newProps.banker.find(item => item.id === newProps.bankerId)
        let oldBanker = this.props.banker.find(item => item.id === this.props.bankerId)
        //Pick field to compare
        if(!_isEqual(newBanker.collapse, oldBanker.collapse)
            || !_isEqual(newBanker.id, oldBanker.id)
            )
            return true
        return false
    }


    render() {
        const banker = this.props.banker.find(item => item.id === this.props.bankerId)
        let classOpenBanker = banker.collapse ? "fa fa-chevron-down" : "fa fa-chevron-up"
        return (
            <div className={"portlet box grey-cascade list-banker-account " + banker.book_name}>
                <div className="portlet-title">
                    <div className="caption">
                        <label className="mt-checkbox caption-subject bold uppercase">
                            <AccountantItemBankerCheckboxContainer bankerId={banker.id} />
                            {banker.name}
                            <span></span>
                        </label>
                    </div>

                    <div className="tools"><a href="#/"  onClick={_ => this.props.collapseBanker('single', banker.id)}><i className={classOpenBanker}></i></a></div>
                </div>
                <Collapse isOpen={banker.collapse} className="portlet-body">
                    <AccountantListBankerAccountContainer bankerId={banker.id} />
                </Collapse>
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        banker : state.AccountantReducer.banker
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: (type, bankerId) => {dispatch(collapseBanker(type, bankerId))},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountanItemBankerContainer);