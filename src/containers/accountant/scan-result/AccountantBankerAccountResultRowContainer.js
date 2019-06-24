import React, { Component } from 'react';
import { compose } from 'redux'
import { connect } from 'react-redux'
import { withTranslation } from 'react-i18next'
import { isEmpty as _isEmpty, forEach as _forEach, concat as _concat } from 'lodash'
import uuidv4 from 'uuid/v4'

import { Helpers } from 'my-utils'


class AccountantBankerAccountResultRowContainer extends Component {
    calcRowSpan = _ => {
        const { item } = this.props
        let col_username = 0
        item.reportAccountant.map(obj => {
            col_username += obj.resultList.length > 0 ? obj.resultList.length : 1
        })
        return col_username
    }
    /*
    |--------------------------------------------------------------------------
    | Generate dynamic column
    | turnover, gross_comm, member_comm, win_loss, company, ma_total
    |--------------------------------------------------------------------------
    */
    generateDynamicRow = _ => {
        const { item } = this.props
        let xhtml = []
        item.reportAccountant.map(obj => {
            let rowSpan = obj.resultList.length > 0 ? obj.resultList.length : 1
            xhtml.push(<td key={uuidv4()} rowSpan={rowSpan}>{obj.reportType.toUpperCase()}</td>)
            _forEach(obj.reportData, value => {
                xhtml.push(<td key={uuidv4()} rowSpan={rowSpan} className="text-right">{value}</td>)
            })
        })
        return xhtml
    }

    /*
    |--------------------------------------------------------------------------
    | Generate formula column
    |--------------------------------------------------------------------------
    */
    generateRowData = _ => {
        const { item, t } = this.props
        let xhtml = []

        //generate username column
        const col_username = this.calcRowSpan()
        xhtml.push(<td rowSpan={col_username}>
                    <span className={`spacing-${item.level}`}></span>
                    {!_isEmpty(item.child) ? (
                        <>
                        <i className="fa fa-chevron-right" />
                        <span className="spacing-0" />
                        </>
                    ): <span className="placeholder-parent" />}
                    <b>{ item.username }</b>
                </td>)


        item.reportAccountant.map(obj => {
            //Generate dynamic data column
            let rowSpan = obj.resultList.length > 0 ? obj.resultList.length : 1
            xhtml.push(<td key={uuidv4()} rowSpan={rowSpan}>{obj.reportType.toUpperCase()}</td>)
            _forEach(obj.reportData, value => {
                xhtml.push(<td key={uuidv4()} rowSpan={rowSpan} className="text-right">{value}</td>)
            })

            //Generate formula column
            if(item.noFormula) {
                xhtml.push(<td key={uuidv4()}>{t("Not have formula yet")}</td>)
                xhtml.push(<td key={uuidv4()}></td>) // Column Member
                xhtml.push(<td key={uuidv4()}></td>) // Column Result
                xhtml.push(<td key={uuidv4()}></td>) // Column Currency
                xhtml.push(<td key={uuidv4()} className="text-center font-red-sunglo"><i className="fa fa-times-circle" /></td>) // Column +/- Formula (delete)
                xhtml.push(<td key={uuidv4()} className="text-center font-green-jungle"><i className="fa fa-plus-circle" /></td>) // Column +/- Formula (add)
            } else {
                obj.resultList.map(formula => {
                    let resultClass = formula.valueRounded > 0 ? 'font-blue-steel' : 'font-red'
                    xhtml.push(
                        <>
                        <td key={uuidv4()} className={formula.PRText}>{formula.formulaName}</td> {/* // Column Formula Name */}
                        <td key={uuidv4()} >{formula.memberName.toUpperCase()}</td> {/* // Column Member */}
                        <td key={uuidv4()} className={resultClass + " text-right"} >{Helpers.formatMoney(formula.valueRounded, 0)}</td> {/* // Column Result */}
                        <td key={uuidv4()} className={resultClass}>{formula.currencyName}</td> {/* // Column Currency */}
                        <td key={uuidv4()} className="text-center font-red-sunglo"><i className="fa fa-times-circle" /></td> {/* // Column +/- Formula (delete) */}
                        <td key={uuidv4()} className="text-center font-green-jungle"><i className="fa fa-plus-circle" /></td> {/* // Column +/- Formula (add) */}
                        </>
                    )
                })
            }
        })
        return xhtml
    }
    
    render() {
        const { item } = this.props
        return (
            <tr>
            {this.generateRowData()}
            </tr>
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
)(AccountantBankerAccountResultRowContainer);