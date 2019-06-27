import React, { Component } from 'react';
import { connect } from 'react-redux'
import { Table } from 'react-bootstrap'
import { isEmpty as _isEmpty, uniq as _uniq, cloneDeep as _cloneDeep, isEqual as _isEqual} from 'lodash'
import uuidv4 from 'uuid/v4'

import {AccountantBankerAccountResultRowContainer, ModalDeleteFormulaContainer} from 'my-containers/accountant'
import {AccountantService} from 'my-services/account'
import { TransComponent } from 'my-components'
import { toggleFullScreen } from 'my-actions/systems/AppAction';


class AccountantBankerAccountResultContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.isShowAllFormula, this.props.isShowAllFormula)
            || !_isEqual(newProps.isFullScreen, this.props.isFullScreen)
            || !_isEqual(newProps.bankerAccountType, this.props.bankerAccountType)
            || !_isEqual(newProps.payload, this.props.payload)
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
                        <AccountantBankerAccountResultRowContainer key={uuidv4()} parent={parent} item={node} bankerAccount={this.props.payload} bankerAccountType={this.props.bankerAccountType} isFullScreen={this.props.isFullScreen} />
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
            return (typeof finded !== "undefined") ? <th key={uuidv4()}><TransComponent i18nKey={finded.value} /></th> : null
        })
    }

    render() {
        const { payload, isFullScreen, isShowAllFormula } = this.props
        const dataFieldList = payload.dataFieldList
        const dataHiddenFields = payload.dataHiddenFields
        const accountant = isShowAllFormula === false ? this.handleProcessDataWhenActiveFilterNoFormula(payload.accountant) : payload.accountant
        
        return (
            <Table responsive striped bordered condensed className="tbl-scan-result">
                <thead>
                    <tr>
                        <th><TransComponent i18nKey="Account" /></th>
                        <th><TransComponent i18nKey="Report Type" /></th>
                        {/* dynamic data */}
                        {this.generateDynamicColumn()}
                        {/* dynamic data */}
                        <th>
                            <span style={{float: 'left', padding: "5px 10px"}}><TransComponent i18nKey="Formula" /></span>
                            <a className="btn btn-default btn-sm btn-fullscreen bg-blue-oleo bg-font-blue-oleo" href="javascript:;" onClick={this.props.toggleFullScreen} style={{float: 'right'}}>
                                <i className="fa fa-info" />
                                {isFullScreen ? <TransComponent i18nKey="Hide" /> : <TransComponent i18nKey="Detail" />}
                            </a>
                        </th>
                        {/* Hidden Column */}
                        {isFullScreen && dataHiddenFields.formatName ? <th><TransComponent i18nKey="Type" /></th> : null} {/* formatName */}
                        {isFullScreen && dataHiddenFields.he_so  ? <th><TransComponent i18nKey="Ratio" /></th> : null}  {/* he_so */}
                        {isFullScreen && dataHiddenFields.gia_thau  ? <th><TransComponent i18nKey="Price" /></th> : null} {/* gia_thau */}
                        {isFullScreen && dataHiddenFields.PRText  ? <th><TransComponent i18nKey="Pay/Rec" /></th> : null} {/* PRText */}
                        {/* Hidden Column */}
                        <th><TransComponent i18nKey="Member" /></th>
                        <th><TransComponent i18nKey="Result" /></th>
                        <th><TransComponent i18nKey="Currency" /></th>
                        <th colSpan="2"><TransComponent i18nKey="+/- Formula" /> </th>
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
        toggleFullScreen: _ => {dispatch(toggleFullScreen())},
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(AccountantBankerAccountResultContainer);