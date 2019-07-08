import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, forEach as _forEach, concat as _concat } from 'lodash'
import uuidv4 from 'uuid/v4'

import { Helpers } from 'my-utils'
import { toggleModalDeleteFormula, toggleModalFormFormula, socketScanData, toggleShowHideBankerAccountChild } from 'my-actions/AccountantAction'
import { TransComponent } from 'my-components'
import { AccountantBankerAccountResultHiddenTableTdContainer } from 'my-containers/accountant'


class AccountantBankerAccountResultRowContainer extends Component {
    /*
    |--------------------------------------------------------------------------
    | Call action to scan data
    |--------------------------------------------------------------------------
    */
    handleRequestScan = account => {
        if (this.props.bankerAccountType === "resolve") {
            const get_child_list = {}
            if(this.props.parents.length) {
                for(let item of this.props.parents) {
                    get_child_list[item.username.toLowerCase()] = true
                    if(item.username === account.username) break
                }
            }
            let ids = [this.props.bankerAccount.id]
            const objScan = {ids: ids,
                            from_date: this.props.bankerAccount.from_date,
                            to_date: this.props.bankerAccount.to_date,
                            more_post: this.props.bankerAccount.more_post
                        }
            if(!_isEmpty(get_child_list)) objScan.more_post.get_child_list = get_child_list
            this.props.socketScanData(objScan)
        }
    }
    
    /*
    |--------------------------------------------------------------------------
    | Calculate rowspan column username
    |--------------------------------------------------------------------------
    */
    calcRowSpanUsername = _ => {
        const { item } = this.props
        let col_username = 0
        item.reportAccountant.map(obj => {
            col_username += obj.resultList.length > 0 ? obj.resultList.length : 1
        })
        return col_username
    }
    /*
    |--------------------------------------------------------------------------
    | Generate formula column
    |--------------------------------------------------------------------------
    */
    generateRowData = _ => {
        const { item, rootAccInfo } = this.props
        const { dataFieldList, dataHiddenFields, scanData } = this.props.bankerAccount
        const bankerAccountId = this.props.bankerAccount.id
        
        let xhtml = []
        let tbl_col_username = []
        
        //generate username column
        const col_username = this.calcRowSpanUsername()
        tbl_col_username.push(<td key={uuidv4()} rowSpan={col_username}>
                                <span className={`spacing-${item.level}`}></span>
                                {!_isEmpty(item.child) ? (
                                    <>
                                    <a onClick={_ => this.props.toggleShowHideBankerAccountChild({bankerAccountId, username: item.username})}>
                                        {typeof item.isShowChild !== "undefined" && item.isShowChild === false ? <i className="fa fa-chevron-right" /> : <i className="fa fa-chevron-down" /> }
                                    </a>
                                    <span className="spacing-0" />
                                    </>
                                ): <span className="placeholder-parent" />}
                                <a onClick={_ => this.handleRequestScan(item)}><b>{ item.username }</b></a>
                            </td>)

    
        let idxFormula = 0
        item.reportAccountant.map(obj => {
            let idxDynamic = 0
            //Generate dynamic data column
            let rowSpanColDynamic = obj.resultList.length > 0 ? obj.resultList.length : 1
            let tbl_col_dynamic = []

            tbl_col_dynamic.push(<td key={uuidv4()} rowSpan={rowSpanColDynamic}>{obj.reportType.toUpperCase()}</td>)
            let dynamicColmn = dataFieldList.map(key => {
                return !_isEmpty(obj.reportData[key]) ? <td key={uuidv4()} rowSpan={rowSpanColDynamic} className="text-right">{Helpers.formatMoney(obj.reportData[key], 2)}</td> : null
            })
            tbl_col_dynamic.push(dynamicColmn)

            let accInfo
            if(typeof item.accInfo !== "undefined") {
                accInfo = item.accInfo
            } else {
                accInfo = {...rootAccInfo, acc_name: item.username, id: -9999}
            }

            //Generate formula column
            if(item.noFormula) {
                idxFormula++
                idxDynamic++
                if (idxDynamic > rowSpanColDynamic ) idxDynamic = 1
                let tbl_col_formula = []

                let objToggleModalSelectedFomula = {bankerAccountId: bankerAccountId, accInfo: accInfo, rootAccInfo: rootAccInfo, scanData: scanData}

                tbl_col_formula.push(
                    <Fragment key={uuidv4()}>
                    <td><TransComponent i18nKey="Not have formula yet" /></td>
                    
                    <AccountantBankerAccountResultHiddenTableTdContainer dataHiddenFields={dataHiddenFields} />

                    <td></td>
                    <td></td>
                    <td></td>
                    <td className="text-center" width="45px"></td>
                    <td className="text-center" width="45px"><a href="#/" onClick={_ => this.props.toggleModalFormFormula(objToggleModalSelectedFomula)} className="font-green-jungle"><i className="fa fa-plus-circle" /></a></td>
                    </Fragment>
                )
                
                xhtml.push(
                    <tr>
                        {idxFormula === 1 ? tbl_col_username : null}
                        {idxDynamic === 1 ? tbl_col_dynamic : null}
                        {tbl_col_formula}
                    </tr>
                )

            } else {
                obj.resultList.map(formula => {
                    // increase index
                    idxFormula++
                    idxDynamic++
                    if (idxDynamic > rowSpanColDynamic ) idxDynamic = 1
                    let resultClass = formula.valueRounded >= 0 ? 'font-blue-steel' : 'font-red'
                    let tbl_col_formula = []
                    
                    let objToggleModalSelectedFomula = {
                        bankerAccountId: bankerAccountId,
                        accInfo: accInfo,
                        rootAccInfo: rootAccInfo,
                        formulaDetail: formula,
                        scanData: scanData
                    }

                    tbl_col_formula.push(
                        <Fragment key={uuidv4()}>
                            <td className={formula.PRText}>{Helpers.formatFormulaName(formula.formulaName)}</td>
                            <AccountantBankerAccountResultHiddenTableTdContainer dataHiddenFields={dataHiddenFields} formula={formula} />
                            <td ><b>{formula.memberName.toUpperCase()}</b></td>
                            <td className={resultClass + " text-right"} >{Helpers.formatMoney(formula.valueRounded, 0)}</td>
                            <td className={resultClass}>{formula.currencyName}</td>
                            <td className="text-center" width="45px"><a href="#/" onClick={_ => this.props.toggleModalDeleteFormula(objToggleModalSelectedFomula)} className="font-red-sunglo"><i className="fa fa-times-circle" /></a></td>
                            {idxDynamic === 1 ? <td className="text-center" width="45px" rowSpan={rowSpanColDynamic}><a href="#/" onClick={_ => this.props.toggleModalFormFormula(objToggleModalSelectedFomula)} className="font-green-jungle"><i className="fa fa-plus-circle" /></a></td> : null}
                        </Fragment>
                    )

                    xhtml.push(
                        <tr key={uuidv4()}>
                            {idxFormula === 1 ? tbl_col_username : null}
                            {idxDynamic === 1 ? tbl_col_dynamic : null}
                            {tbl_col_formula}
                        </tr>
                    )
                })
            }
        })
        return (
            <tbody>
                {xhtml}
            </tbody>
        )
    }
    
    render() {
        return (
            this.generateRowData()
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteFormula: (params) => {dispatch(toggleModalDeleteFormula(params))},
        toggleModalFormFormula: (params) => {dispatch(toggleModalFormFormula(params))},
        socketScanData: params => {dispatch(socketScanData(params))},
        toggleShowHideBankerAccountChild: params => {dispatch(toggleShowHideBankerAccountChild(params))},
    }
};

export default connect(null, mapDispatchToProps)(AccountantBankerAccountResultRowContainer);