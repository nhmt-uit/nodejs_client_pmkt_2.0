import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'
import { isEmpty as _isEmpty, uniq as _uniq, cloneDeep as _cloneDeep, isEqual as _isEqual} from 'lodash'
import uuidv4 from 'uuid/v4'

import { AccountantBankerAccountResultHiddenTableThContainer, AccountantBankerAccountResultRowContainer, ModalDeleteFormulaContainer } from 'my-containers/accountant'
import {AccountantService} from 'my-services/account'
import { TransComponent } from 'my-components'
import { toggleFullScreen } from 'my-actions/systems/AppAction';


class AccountantBankerAccountResultContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(_isEmpty(newProps.payload)) return false
        //Prevent update when bankerAccount collapse
        if(newProps.isCollapseBankerAccount !== false || newProps.isCollapseBanker !== false) return false

        if(!_isEqual(newProps.isShowAllFormula, this.props.isShowAllFormula)
            || !_isEqual(newProps.bankerAccountType, this.props.bankerAccountType)
            || !_isEqual(newProps.payload, this.props.payload)
            )
            return true
        return false;
    }

    componentWillMount() {
        this.dynamicColumn = AccountantService.getDynamicColumn()
    }

    handleNestedDataAccountant = (item, parents = [], rootAccInfo, rootAccInfoFull) => {
        const isShowAllFormula = this.props.isShowAllFormula
        
        return item.map(node => {
            if(node.level === 0){
                rootAccInfo = node.accInfo
                rootAccInfoFull = node
            }
            parents.push(node)

            return (
                <Fragment key={uuidv4()}>
                    {(isShowAllFormula === false && this.handleNestedChedkHasFormula(node)) || (isShowAllFormula) ?
                        <AccountantBankerAccountResultRowContainer rootAccInfoFull={rootAccInfoFull} rootAccInfo={rootAccInfo} parents={parents} item={node} bankerAccount={this.props.payload} bankerAccountType={this.props.bankerAccountType} />
                        : null
                    }
                    {node.child.length === 0 || (typeof node.isShowChild !== "undefined" && node.isShowChild === false) ? null : this.handleNestedDataAccountant(node.child, parents, rootAccInfo, rootAccInfoFull)}
                </Fragment>
            )
        })
    }

    handleProcessDataWhenActiveFilterNoFormula = (item) => {
        if (_isEmpty(item)) return
        item = [...item]
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

    /*
    |--------------------------------------------------------------------------
    | Generate Dynamic Column From Response Data
    |--------------------------------------------------------------------------
    */
    generateDynamicColumn = _ => {
        const dataFieldList = this.props.payload.dataFieldList
        return dataFieldList.map(key => {
            let finded = this.dynamicColumn.find(item => item.key === key)
            return (typeof finded !== "undefined") ? <th key={uuidv4()}><TransComponent i18nKey={finded.value} /></th> : null
        })
    }

    render() {
        const { payload, isFullScreen, isShowAllFormula } = this.props
        if (_isEmpty(payload)) return null

        const dataHiddenFields = payload.dataHiddenFields
        const accountant = isShowAllFormula === false ? this.handleProcessDataWhenActiveFilterNoFormula(_cloneDeep(payload.accountant)) : _cloneDeep(payload.accountant)
        
        return (
            <div className="panel-body bootstrap-table">
                <div className="table-responsive">
                    <Table responsive striped bordered condensed className="tbl-scan-result">
                        <thead>
                            <tr>
                                <th><TransComponent i18nKey="Account" /></th>
                                <th><TransComponent i18nKey="Report Type" /></th>
                                {this.generateDynamicColumn()}
                                <th>
                                    <span style={{float: 'left', padding: "5px 10px"}}><TransComponent i18nKey="Formula" /></span>
                                    <a className="btn btn-default btn-sm btn-fullscreen bg-blue-oleo bg-font-blue-oleo" href="javascript:;" onClick={_ => this.props.toggleFullScreen() } style={{float: 'right'}}>
                                        <i className="fa fa-info" />
                                        {isFullScreen ? <TransComponent i18nKey="Hide" /> : <TransComponent i18nKey="Detail" />}
                                    </a>
                                </th>
                                <AccountantBankerAccountResultHiddenTableThContainer dataHiddenFields={dataHiddenFields} />
                                <th><TransComponent i18nKey="Member" /></th>
                                <th><TransComponent i18nKey="Result" /></th>
                                <th><TransComponent i18nKey="Currency" /></th>
                                <th colSpan="2"><TransComponent i18nKey="+/- Formula" /> </th>
                            </tr>
                        </thead>
                        { !_isEmpty(accountant) ? this.handleNestedDataAccountant(accountant) : null }
                    </Table>
                </div>
            </div>
        )
    }
}



const mapStateToProps = state => {
    return {
        isShowAllFormula : state.AccountantReducer.isShowAllFormula,
        isCollapseBanker : state.AccountantReducer.isCollapseBanker,
        isCollapseBankerAccount : state.AccountantReducer.isCollapseBankerAccount,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFullScreen: _ => {dispatch(toggleFullScreen())},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantBankerAccountResultContainer);