import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { Table } from 'react-bootstrap'
import { isEmpty as _isEmpty} from 'lodash'
import uuidv4 from 'uuid/v4'

import {AccountantBankerAccountResultRowContainer} from 'my-containers/accountant'


class AccountantBankerAccountResultContainer extends Component {

    handleNestedDataAccountant = (item, parent = null) => {
        return item.map(node => {
            return (
                <>
                    <AccountantBankerAccountResultRowContainer key={uuidv4()} item={node} parent={parent}/>
                    {node.child.length === 0 ? null : this.handleNestedDataAccountant(node.child, node)}
                </>
            )
        })
    }
    

    render() {
        const { t, payload } = this.props
        const dataFieldList = payload.dataFieldList
        const accountant = payload.accountant
        
        return (
            <Table responsive striped bordered condensed hover className="tbl-scan-result">
                <thead>
                    <tr>
                        <th width="15%">{t("Account")}</th>
                        <th>{t("Report Type")}</th>
                        {/* dynamic data */}
                        {dataFieldList.indexOf("turnover") !== -1 ? <th>{t("Turn over")}</th> : null}
                        {dataFieldList.indexOf("gross_comm") !== -1 ? <th>{t("GrossComm")}</th> : null}
                        {dataFieldList.indexOf("member_comm") !== -1 ? <th>{t("MemberComm")}</th> : null}
                        {dataFieldList.indexOf("win_loss") !== -1 ? <th>{t("Win lose")}</th> : null}
                        {dataFieldList.indexOf("company") !== -1 ? <th>{t("Company")}</th> : null}
                        {dataFieldList.indexOf("ma_total") !== -1 ? <th>{t("Total code")}</th> : null}
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
                <tbody>
                    { !_isEmpty(accountant) ? this.handleNestedDataAccountant(accountant) : null }
                </tbody>
            </Table>
        )
    }
}



const mapStateToProps = state => {
    return {

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