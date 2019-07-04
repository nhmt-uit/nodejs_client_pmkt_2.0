import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'

import { TransComponent } from 'my-components';
import { FormulaModalContainer } from 'my-containers/formula';
import { FormulaService } from 'my-services/formula';

export default class FormulaItemContainer extends Component {
    static propTypes = {
        formula: PropTypes.object,
    }

    static defaultProps = {
        formula: {}
    };

    constructor(props) {
        super(props);

        this.state = {
            isOpenAccountModal: false,
            listAccDelete: [],
        };
    }

    handleChangeState = (state, cb) => () => {
        this.setState(state, () => {
            if (typeof cb === 'function') {
                cb();
            }
        });
    }

    handleToggleDelete = id => () => {
        const listAccDelete = this.state.listAccDelete;

        if (listAccDelete.includes(id)) {
            listAccDelete.splice(listAccDelete.indexOf(id) , 1);
        } else {
            listAccDelete.push(id);
        }

        this.setState({ listAccDelete });
    }

    handleDeleteAccountUseFormula = () => {
        FormulaService.deleteAccountUseFormula(this.state.listAccDelete)
            .then(res => {
                if (res.status) {
                    return this.props.onGetFormula();
                }
            });
    }

    renderBodyAccountModal = () => {
        const { formula } = this.props;
        const listAccUse = formula.list_acc_use || [];

        return (
            <table className="table table-hover table-formula table-bordered">
                <thead>
                    <tr>
                        <th><TransComponent i18nKey={'Member'}/></th>
                        <th><TransComponent i18nKey="Account" /></th>
                        <th><TransComponent i18nKey={'Formula name'}/></th>
                        <th className="text-center"><TransComponent i18nKey={'Edit'}/></th>
                        <th className="text-center">
                            <button disabled={!(this.state.listAccDelete.length > 0)} className="btn btn-danger" onClick={this.handleDeleteAccountUseFormula}>
                                <TransComponent i18nKey="Delete" />
                            </button>
                            </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        listAccUse.map((acc, index) => (
                            <tr key={index}>
                                <td>{ acc.user.fullname.toUpperCase() }</td>
                                <td>{ acc.account.acc_name.toUpperCase() }</td>
                                <td>{ formula.tenct }</td>
                                <td className="text-center"><i className="fa fa-edit font-blue-steel" /></td>
                                <td className="text-center">
                                    <label className="mt-checkbox mt-checkbox-outline">
                                        <input type="checkbox" onChange={this.handleToggleDelete(acc.id)} />
                                        <span />
                                    </label>
                                </td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        );
    }

    render() {
        const { formula, order } = this.props;
        const { isOpenAccountModal } = this.state;
        const fieldValueLength = _get(formula, 'field_value.length', 0);
        const fieldValElement = (
            <>
                <td><TransComponent i18nKey={_get(formula, 'field_value[0].field_name', '')} /></td>
                <td>{ _get(formula, 'field_value[0].value', '') }</td>
            </>
        );
        const extraFieldValElement = _get(formula, 'field_value', []).map(function (item, index) {
            if (index === 0) {
                return null;
            }

            return (
                <tr key={index}>
                    <td><TransComponent i18nKey={item.field_name} /></td>
                    <td>{item.value}</td>
                </tr>
            )
        });

        return (
            <>
                <tr>
                    <td rowSpan={fieldValueLength}>{ order }</td>
                    <td rowSpan={fieldValueLength}
                        className={"tenct"}>{ formula.tenct }</td>
                    <td rowSpan={fieldValueLength} className="text-capitalize">{ formula.book_name }</td>
                    <td rowSpan={fieldValueLength} className="text-uppercase">{ formula.banker_name }</td>
                    <td rowSpan={fieldValueLength}>{ formula.currency_name }</td>
                    <td rowSpan={fieldValueLength}>{
                        formula.giaonhan === '1' 
                        ? <TransComponent i18nKey={'Pay'}/> 
                        : <TransComponent i18nKey={'Receive'}/>
                    }</td>
                    <td rowSpan={fieldValueLength} className="text-center">{ formula.format_name }</td>
                    { fieldValElement }
                    <td rowSpan={fieldValueLength} className={"text-center"}>
                        <span onClick={this.handleChangeState({ isOpenAccountModal: !isOpenAccountModal })} className="font-green cursor-pointer">{formula.total_account}</span>
                    </td>
                    <td rowSpan={fieldValueLength} className="text-center">Relink</td>
                    <td rowSpan={fieldValueLength}>Edit</td>
                    <td rowSpan={fieldValueLength} className="text-center"><i className="fa fa-trash-o font-red" /></td>
                </tr>
                { extraFieldValElement }
                <FormulaModalContainer 
                    isOpen={isOpenAccountModal} 
                    header={<strong><TransComponent i18nKey="Formula" /></strong>} 
                    onToggle={this.handleChangeState({ isOpenAccountModal: !isOpenAccountModal })}
                    body={this.renderBodyAccountModal()}
                    size="lg"
                />
            </>
        )
    }
}
