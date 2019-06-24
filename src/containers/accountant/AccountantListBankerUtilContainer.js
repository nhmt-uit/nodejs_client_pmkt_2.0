
import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { has as _has, isEmpty as _isEmpty } from 'lodash'

import { checkBankerAccount, collapseBanker } from 'my-actions/AccountantAction';


class AccountantListBankerUtilContainer extends Component {
    render() {
        const { t } = this.props
        if (this.props.socketInitStatus !== "finish") return null
        const isCheckAll = _isEmpty(this.props.banker.filter(item => !item.checked)) ? true : false
        const isCollapseAll = _isEmpty(this.props.banker.filter(item => !item.collapse)) ? true : false
        return (
            <div className="row">
                <div className="form-group col-md-4 col-sm-4">
                    <label className="mt-checkbox uppercase">
                        <input type="checkbox" onChange={_ => this.props.checkBankerAccount('check_all', {isCheckAll: !isCheckAll})} checked={isCheckAll} /> {t("Select All")}
                        <span></span>
                    </label>
                </div>
                <div className="form-group col-md-8 text-right">
                    <label className="mt-checkbox uppercase" style={{marginRight: '50px'}}>
                        <input type="checkbox" onChange={_ => null} /> {t("show all")}
                        <span></span>
                    </label>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.checkBankerAccount('check_all_error')} > {t("Select error accounts")}</a>
                    <a href="#/" type="submit" className="btn btn-default red" onClick={_ => this.props.collapseBanker(isCollapseAll ? "close_all" : "open_all")} > {t(isCollapseAll ? "Close all" : "Open all")}</a>
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
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        collapseBanker: (type) => {dispatch(collapseBanker(type))},
        checkBankerAccount: (type_check, params) => {dispatch(checkBankerAccount(type_check, params))},
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantListBankerUtilContainer);