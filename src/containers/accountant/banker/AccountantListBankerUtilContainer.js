
import React, { Component } from 'react';
import { connect } from 'react-redux'
import { has as _has, isEmpty as _isEmpty, isEqual as _isEqual } from 'lodash'

import { checkBankerAccount, collapseBanker, toggleShowAllFormula } from 'my-actions/AccountantAction';
import { TransComponent } from 'my-components'


class AccountantListBankerUtilContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.socketInitStatus, this.props.socketInitStatus)
            || !_isEqual(newProps.banker, this.props.banker)
            || !_isEqual(newProps.isShowAllFormula, this.props.isShowAllFormula)
            )
            return true
        return false;
    }

    render() {
        if (this.props.socketInitStatus !== "finish") return null
        const isCheckAll = _isEmpty(this.props.banker.filter(item => !item.checked)) ? true : false
        const isCollapseAll = _isEmpty(this.props.banker.filter(item => !item.collapse)) ? true : false
        return (
            <div className="row">
                <div className="form-group col-xs-4 col-md-4">
                    <label className="mt-checkbox uppercase">
                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount('check_all', {isCheckAll: !isCheckAll})} checked={isCheckAll} /> <TransComponent i18nKey="Select All" />
                        <span></span>
                    </label>
                </div>
                <div className="form-group col-xs-8 col-md-8 text-right">
                    <label className="mt-checkbox uppercase" style={{marginRight: '50px'}}>
                        <input type="checkbox" onChange={this.props.toggleShowAllFormula} checked={this.props.isShowAllFormula} /> <TransComponent i18nKey="show all" />
                        <span></span>
                    </label>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.checkBankerAccount('check_all_error')} > <TransComponent i18nKey="Select error accounts" /></a>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.collapseBanker(isCollapseAll ? "close_all" : "open_all")} > <TransComponent i18nKey={isCollapseAll ? "Close all" : "Open all"} /> </a>
                </div>
                <div className="clearfix"></div>
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        socketInitStatus : state.AccountantReducer.socketInitStatus,
        banker : state.AccountantReducer.banker,
        isShowAllFormula : state.AccountantReducer.isShowAllFormula,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: (type) => {dispatch(collapseBanker(type))},
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
        toggleShowAllFormula: _ => {dispatch(toggleShowAllFormula())},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantListBankerUtilContainer);