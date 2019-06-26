import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Table } from 'react-bootstrap'
import { isEmpty as _isEmpty, uniq as _uniq, cloneDeep as _cloneDeep, isEqual as _isEqual} from 'lodash'
import uuidv4 from 'uuid/v4'

import {AccountantBankerAccountResultRowContainer, ModalDeleteFormulaContainer} from 'my-containers/accountant'
import {AccountantService} from 'my-services/account'


class AccountantBankerAccountResultContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.isShowAllFormula, this.props.isShowAllFormula)
            || !_isEqual(newProps.isFullScreen, this.props.isFullScreen)
            )
            return true
        return false;
    }

    componentWillMount() {
        this.dynamicColumn = AccountantService.getDynamicColumn()
    }

    handleNestedDataAccountant = (item, parent) => {
        const isShowAllFormula = this.props.isShowAllFormula
        
        return item.map((node, idx) => {
            return (
                <>
                    {(isShowAllFormula === false && this.handleNestedChedkHasFormula(node)) || (isShowAllFormula) ?
                        <AccountantBankerAccountResultRowContainer key={uuidv4()} parent={parent} item={node} bankerAccount={this.props.payload} bankerAccountType={this.props.bankerAccountType} />
                        : null
                    }
                    {node.child.length === 0 || (typeof node.isShowChild !== "undefined" && node.isShowChild === false) ? null : this.handleNestedDataAccountant(node.child, node)}
                </>
            )
        })
    }

    handleProcessDataWhenActiveFilterNoFormula = (item) => {
        const isShowAllFormula = this.props.isShowAllFormula
        if (_isEmpty(item)) return
        return item.map(node => {
            if(_uniq(node.child.map(node => this.handleNestedChedkHasFormula(node))).indexOf(true) === -1) {
                node.child = []
            }
            this.handleProcessDataWhenActiveFilterNoFormula(node.child)
            return node
        })
    }

    handleNestedChedkHasFormula = (item) => {
        if(item.noFormula === false){
            return true
        } else {
            if(item.child.length === 0) {
                return false
            } else {
                return _uniq(item.child.map(node => this.handleNestedChedkHasFormula(node))).indexOf(true) !== -1 ? true : false
            }
        }
    }

    generateDynamicColumn = _ => {
        const dataFieldList = this.props.payload.dataFieldList
        return dataFieldList.map(key => {
            let finded = this.dynamicColumn.find(item => item.key === key)
            return (typeof finded !== "undefined") ? <th key={uuidv4()}>{this.props.t(finded.value)}</th> : null
        })
    }

    render() {
        const { t, payload, isFullScreen, isShowAllFormula } = this.props
        const dataFieldList = payload.dataFieldList
        const accountant = isShowAllFormula === false ? this.handleProcessDataWhenActiveFilterNoFormula(_cloneDeep(payload.accountant)) : _cloneDeep(payload.accountant)
        
        return (
            <Table responsive striped bordered condensed className="tbl-scan-result">
                <thead>
                    <tr>
                        <th width="15%">{t("Account")}</th>
                        <th>{t("Report Type")}</th>
                        {/* dynamic data */}
                        {this.generateDynamicColumn()}
                        {/* dynamic data */}
                        <th>{t("Formula")}</th>
                        {/* Hidden Column */}
                        {isFullScreen ? <th>{t("lock out")}</th> : null}
                        {isFullScreen ? <th>{t("Ratio")}</th> : null}
                        {isFullScreen ? <th>{t("Price")}</th> : null}
                        {isFullScreen ? <th>{t("Pay/Rec")}</th> : null}
                        {/* Hidden Column */}
                        <th>{t("Member")}</th>
                        <th>{t("Result")}</th>
                        <th>{t("Currency")}</th>
                        <th colSpan="2">{t("+/- Formula")}</th>
                    </tr>
                </thead>
                { !_isEmpty(accountant) ? this.handleNestedDataAccountant(accountant) : null }
            </Table>
        )
    }
}



const mapStateToProps = state => {
    return {
        isShowAllFormula : state.AccountantReducer.isShowAllFormula,
        isFullScreen : state.AppReducer.isFullScreen,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {

    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(AccountantBankerAccountResultContainer);