import React, { Component } from 'react';
import { connect } from 'react-redux'
import { isEmpty as _isEmpty, forEach as _forEach, concat as _concat } from 'lodash'
import uuidv4 from 'uuid/v4'

import { Helpers } from 'my-utils'
import { toggleModalDeleteFormula, socketScanData, toggleShowHideBankerAccountChild } from 'my-actions/AccountantAction'
import { TransComponent } from 'my-components'


class AccountantBankerAccountResultRowContainer extends Component {
    /*
    |--------------------------------------------------------------------------
    | Call action to scan data
    |--------------------------------------------------------------------------
    */
    handleRequestScan = _ => {
        // let finded = this.dynamicColumn.find(item => item.key === key)
        if (this.props.bankerAccountType === "resolve") {
            let ids = [this.props.bankerAccount.id]
            this.props.socketScanData({ids: ids, from_date: this.props.bankerAccount.from_date, to_date: this.props.bankerAccount.to_date})
        }
    }

    /*
    |--------------------------------------------------------------------------
    | Toggle Modal Delete Formula
    |--------------------------------------------------------------------------
    */
    handleToggleModalDeleteFormula = formulaDetail => {
        this.props.toggleModalDeleteFormula()
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
        const { item, isFullScreen } = this.props
        const { dataFieldList, dataHiddenFields, scanData } = this.props.bankerAccount
        const bankerAccountId = this.props.bankerAccount.id
        
        let xhtml = []
        let final_xhtml = []
        let tbl_col_username = []
        
        //generate username column
        const col_username = this.calcRowSpanUsername()
        tbl_col_username.push(<td key={uuidv4()}  rowSpan={col_username}>
                                <span className={`spacing-${item.level}`}></span>
                                {!_isEmpty(item.child) ? (
                                    <>
                                    <a onClick={_ => this.props.toggleShowHideBankerAccountChild({bankerAccountId, username: item.username})}>
                                        {typeof item.isShowChild !== "undefined" && item.isShowChild === false ? <i className="fa fa-chevron-right" /> : <i className="fa fa-chevron-down" /> }
                                    </a>
                                    <span className="spacing-0" />
                                    </>
                                ): <span className="placeholder-parent" />}
                                <a onClick={this.handleRequestScan}><b>{ item.username }</b></a>
                            </td>)

    
        let idxFormula = 0
        item.reportAccountant.map(obj => {
            let idxDynamic = 0
            //Generate dynamic data column
            let rowSpanColDynamic = obj.resultList.length > 0 ? obj.resultList.length : 1
            let tbl_col_dynamic = []

            tbl_col_dynamic.push(<td key={uuidv4()} rowSpan={rowSpanColDynamic}>{obj.reportType.toUpperCase()}</td>)
            let dynamicColmn = dataFieldList.map(key => {
                return !_isEmpty(obj.reportData[key]) ? <td key={uuidv4()} rowSpan={rowSpanColDynamic} className="text-right">{Helpers.formatMoney(obj.reportData[key], 0)}</td> : null
            })
            tbl_col_dynamic.push(dynamicColmn)


            //Generate formula column
            if(item.noFormula) {
                idxFormula++
                idxDynamic++
                if (idxDynamic > rowSpanColDynamic ) idxDynamic = 1
                let tbl_col_formula = []

                let objToggleModalDeleteFomula = {bankerAccountId: bankerAccountId, accInfo: item.accInfo, scanData: scanData}

                tbl_col_formula.push(
                    <>
                    <td key={uuidv4()}><TransComponent i18nKey="Not have formula yet" /></td> {/* // Column Formula Name */}
                    
                    {isFullScreen && dataHiddenFields.formatName ?  <td key={uuidv4()}></td> : null} {/* formatName */}
                    {isFullScreen && dataHiddenFields.he_so  ?  <td key={uuidv4()}></td> : null}  {/* he_so */}
                    {isFullScreen && dataHiddenFields.gia_thau  ?  <td key={uuidv4()}></td> : null} {/* gia_thau */}
                    {isFullScreen && dataHiddenFields.PRText  ?  <td key={uuidv4()}></td> : null} {/* PRText */}

                    <td key={uuidv4()}></td> {/* // Column Member */}
                    <td key={uuidv4()}></td> {/* // Column Result */}
                    <td key={uuidv4()}></td> {/* // Column Currency */}
                    <td key={uuidv4()} className="text-center" width="45px"></td> {/* // Column +/- Formula (delete) */}
                    <td key={uuidv4()} className="text-center" width="45px"><a href="#/" onClick={_ => this.props.toggleModalDeleteFormula(objToggleModalDeleteFomula)} className="font-green-jungle"><i className="fa fa-plus-circle" /></a></td> {/* // Column +/- Formula (add) */}
                    </>
                )
                
                xhtml.push(
                    <tr key={uuidv4()}>
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


                    
                    let objToggleModalDeleteFomula = {bankerAccountId: bankerAccountId, accInfo: item.accInfo, formulaDetail: formula, scanData: scanData}

                    tbl_col_formula.push(
                        <>
                        <td key={uuidv4()} className={formula.PRText}>{Helpers.formatFormulaName(formula.formulaName)}</td> {/* // Column Formula Name */}

                        {isFullScreen && dataHiddenFields.formatName ?  <td key={uuidv4()} className={formula.PRText}>{formula.formatName}</td> : null} {/* formatName */}
                        {isFullScreen && dataHiddenFields.he_so  ?  <td key={uuidv4()} className={formula.PRText + " text-right"}>{formula.he_so}</td> : null}  {/* he_so */}
                        {isFullScreen && dataHiddenFields.gia_thau  ?  <td key={uuidv4()} className={formula.PRText + " text-right"}>{formula.gia_thau}</td> : null} {/* gia_thau */}
                        {isFullScreen && dataHiddenFields.PRText  ?  <td key={uuidv4()} className={formula.PRText}>{formula.PRText === 'rec' ? <TransComponent i18nKey="Receive" /> : <TransComponent i18nKey="Pay" />}</td> : null} {/* PRText */}

                        <td key={uuidv4()} ><b>{formula.memberName.toUpperCase()}</b></td> {/* // Column Member */}
                        <td key={uuidv4()} className={resultClass + " text-right"} >{Helpers.formatMoney(formula.valueRounded, 0)}</td> {/* // Column Result */}
                        <td key={uuidv4()} className={resultClass}>{formula.currencyName}</td> {/* // Column Currency */}
                        <td key={uuidv4()} className="text-center" width="45px"><a href="#/" onClick={_ => this.props.toggleModalDeleteFormula(objToggleModalDeleteFomula)} className="font-red-sunglo"><i className="fa fa-times-circle" /></a></td> {/* // Column +/- Formula (delete) */}
                        {idxDynamic === 1 ? <td key={uuidv4()} className="text-center" width="45px" rowSpan={rowSpanColDynamic}><a href="#/" onClick={_ => this.props.toggleModalDeleteFormula(objToggleModalDeleteFomula)} className="font-green-jungle"><i className="fa fa-plus-circle" /></a></td> : null} {/* // Column +/- Formula (add) */}
                        </>
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

            // Generate final html <tbody><tr><td></td></tr></tbody>
            // final_xhtml.push(xhtml)
        })
        return (
            <tbody key={uuidv4()}>
                {xhtml}
            </tbody>
        )
    }
    
    render() {
        const { item } = this.props
        return (
            this.generateRowData()
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleModalDeleteFormula: (params) => {dispatch(toggleModalDeleteFormula(params))},
        socketScanData: params => {dispatch(socketScanData(params))},
        toggleShowHideBankerAccountChild: params => {dispatch(toggleShowHideBankerAccountChild(params))},
    }
};

export default connect(null, mapDispatchToProps)(AccountantBankerAccountResultRowContainer);