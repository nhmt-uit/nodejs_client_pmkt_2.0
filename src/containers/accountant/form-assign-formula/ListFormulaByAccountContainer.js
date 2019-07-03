import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from "redux-form";
import { get as _get } from 'lodash'

import { ModalDeleteFormulaByAccountContainer } from 'my-containers/accountant'
import { TransComponent } from 'my-components'
import { toggleModalDeleteFormulaByAccount } from 'my-actions/AccountantAssignFormulaAction'

class ListFormulaByAccountContainer extends Component {

    state = {
        congthuctinhIds: []
    }

    
    componentWillReceiveProps(newProps) {
        // this.initDetailData(account_id)
    }

    handleDeleteFormula = formula => {
        const params = {
            type: 'single',
            congthuctinhId: formula.id,
            account_id: formula.account_id
        }
        this.props.toggleModalDeleteFormulaByAccount(params)
    }

    handleMultipleDeleteFormula = formula => {
        const params = {
            type: 'multiple',
            congthuctinhIds: this.state.congthuctinhIds,
            account_id: this.props.selectedAccountId
        }
        this.props.toggleModalDeleteFormulaByAccount(params)
    }

    handleCheckFormula = (e, item) => {
        const isChecked = e.target.checked;
        const formulaId = item.id
        if(isChecked) {
            this.state.congthuctinhIds.push(formulaId)
        } else {
            this.state.congthuctinhIds = this.state.congthuctinhIds.filter(id => id !== formulaId)
        }
        this.setState({congthuctinhIds : this.state.congthuctinhIds})
    }
    
    renderDetailData = formulaPayload => {
        let xhtml = null
        if (formulaPayload.length) {
            xhtml = formulaPayload.map((item, idx) => {
                return (
                    <tr key={idx}>
                        <td> {++idx} </td>
                        <td> {item.fullname.toUpperCase()} </td>
                        <td> {item.formula_group_name} </td>
                        <td> {item.tenct} </td>
                        <td className="text-center">
                            <label className="mt-checkbox uppercase">
                                <input type="checkbox" onChange={e => this.handleCheckFormula(e, item)} checked={this.state.congthuctinhIds.indexOf(item.id) !== -1}  />
                                <span></span>
                            </label>
                        </td>
                        <td className="text-center">
                            <a href="#/" className="font-red-sunglo" onClick={_ => this.handleDeleteFormula(item)}> <i className="fa fa-close" /> </a>
                        </td>
                    </tr>
                )
            })
        }
        return xhtml
    }

    render() {
        const { listFormulaDetail } = this.props
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject font-green bold uppercase"><TransComponent i18nKey="Detail" /></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-scrollable">
                        <table className="table table-striped table-bordered table-hover table-animation">
                            <thead>
                                <tr className="font-red-sunglo">
                                    <th className="text-center"> # </th>
                                    <th className="text-center"> <TransComponent i18nKey="Member" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Formula group" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Formula" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Multi select" /> </th>
                                    <th className="text-center"> <TransComponent i18nKey="Delete" /> </th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.renderDetailData(listFormulaDetail)}
                            </tbody>
                        </table>
                    </div>
                    {listFormulaDetail.length ?
                        <div className="form-actions text-right">
                            <button type="button" className="btn red" disabled={!this.state.congthuctinhIds.length} onClick={this.handleMultipleDeleteFormula}>
                                <TransComponent i18nKey="Delete selected" />
                            </button>
                        </div>
                        : null
                    }
                </div>
                <ModalDeleteFormulaByAccountContainer />
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        selectedAccountId: state.AccountantAssignFormulaReducer.selectedAccountId,
        listFormulaDetail: state.AccountantAssignFormulaReducer.listFormulaDetail,
    }
};

const mapDispatchToProps = dispatch => {
    return {
        toggleModalDeleteFormulaByAccount: params => dispatch(toggleModalDeleteFormulaByAccount(params)),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(ListFormulaByAccountContainer)
