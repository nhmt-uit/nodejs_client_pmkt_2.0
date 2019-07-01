import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { reduxForm } from "redux-form";
import { get as _get } from 'lodash'

import { TransComponent } from 'my-components'
import { FormulaService } from 'my-services/formula'

class ListFormulaBasedAccountContainer extends Component {

    state = {
        formulaPayload: []
    }

    componentWillReceiveProps(newProps) {
        const account_id = _get(newProps, 'initialValues.account.value')
        this.initDetailData(account_id)
    }

    
    initDetailData = account_id => {
        FormulaService.getFormulaByAccountId(account_id).then(res => {
            if (res.status) {
                this.setState({formulaPayload: res.res.data.data})
            }
        })
    }

    renderDetailData = formulaPayload => {
        let xhtml = null
        if (formulaPayload.length) {
            xhtml = formulaPayload.map((item, idx) => {
                return (
                    <tr key={idx}>
                        <td> {++idx} </td>
                        <td> {item.fullname} </td>
                        <td> {item.formula_group_name} </td>
                        <td> {item.tenct} </td>
                        <td className="text-center">
                            <label className="mt-checkbox uppercase">
                                <input type="checkbox" onChange={ _ => null } onClick={ _ => console.log("check") } />
                                <span></span>
                            </label>
                        </td>
                        <td className="text-center font-red-sunglo"> <i className="fa fa-close" /> </td>
                    </tr>
                )
            })
        }
        return xhtml
    }

    render() {
        const { formulaPayload } = this.state
        if(!formulaPayload.length) return null
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption">
                        <span className="caption-subject font-green bold uppercase"><TransComponent i18nKey="Detail" /></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="table-scrollable">
                        <table className="table table-striped table-bordered table-hover">
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
                                {this.renderDetailData(formulaPayload)}
                            </tbody>
                        </table>
                    </div>
                    <div className="form-actions text-right">
                        <button type="button" className="btn red"><TransComponent i18nKey="Delete selected" /></button>
                    </div>
                </div>
            </div>
        );
    }
}


const mapStateToProps = state => {
    return {
        initialValues: _get(state, 'form.form_assign_formula.values', {}),
    }
};


export default compose(
    reduxForm({
        form: 'form_assign_formula',
    }),
    connect(mapStateToProps, null),
)(ListFormulaBasedAccountContainer)
