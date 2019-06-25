import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Table } from 'react-bootstrap'
import { isEmpty as _isEmpty, uniq as _uniq} from 'lodash'
import uuidv4 from 'uuid/v4'

import {AccountantBankerAccountResultRowContainer, ModalDeleteFormulaContainer} from 'my-containers/accountant'
import {AccountantService} from 'my-services/account'


class AccountantBankerAccountResultContainer extends Component {

    componentWillMount() {
        this.dynamicColumn = AccountantService.getDynamicColumn()
    }

    handleNestedDataAccountant = (item) => {
        const isShowAllFormula = this.props.isShowAllFormula
        const bankerAccountId = this.props.payload.id
        const dataFieldList = this.props.payload.dataFieldList
        const scanData = this.props.payload.scanData
        
        return item.map(node => {
            console.log(node, this.handleNestedChedkHasFormula(node))
            return (
                <>
                    {(isShowAllFormula === false && this.handleNestedChedkHasFormula(node)) || (isShowAllFormula) ?
                        <AccountantBankerAccountResultRowContainer key={uuidv4()} item={node} dataFieldList={dataFieldList} scanData={scanData} bankerAccountId={bankerAccountId} />
                        : null
                    }
                    {node.child.length === 0 ? null : this.handleNestedDataAccountant(node.child)}
                </>
            )
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
        
        const { t, payload } = this.props
        const dataFieldList = payload.dataFieldList
        const accountant = payload.accountant
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
                        {/* <th>{t("lock out")}</th>
                        <th>{t("Ratio")}</th>
                        <th>{t("Price")}</th>
                        <th>{t("Pay/Rec")}</th> */}
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