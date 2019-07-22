import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { get as _get } from 'lodash'

import { TransComponent } from 'my-components';

export default class FormulaItemContainer extends Component {
    static propTypes = {
        formula: PropTypes.object,
    }

    static defaultProps = {
        formula: {}
    };

    render() {
        const { formula, order } = this.props;
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
                        formula.giaonhan === 1
                        ? <TransComponent i18nKey={'Pay'}/>
                        : <TransComponent i18nKey={'Receive'}/>
                    }</td>
                    <td rowSpan={fieldValueLength}>{ formula.format_name }</td>
                    { fieldValElement }
                    <td rowSpan={fieldValueLength} className={"text-center"}>
                        <span onClick={() => this.props.onToggle('account', formula)} className="font-green cursor-pointer">{formula.total_account}</span>
                    </td>
                    <td rowSpan={fieldValueLength} className="text-center">
                        {
                            (formula.total_account && formula.total_account > 0)
                                ? <i className="fa fa-exchange font-green cursor-pointer" onClick={() => this.props.onToggle('relink', formula)} />
                                : null
                        }
                    </td>
                    <td rowSpan={fieldValueLength}><i onClick={() => this.props.onToggleEditModal(formula)} className="fa fa-edit font-green cursor-pointer" /></td>
                    <td rowSpan={fieldValueLength} className="text-center">
                        <i onClick={() => this.props.onToggle('delete', formula)} className="fa fa-trash-o font-red cursor-pointer" />
                    </td>
                </tr>
                { extraFieldValElement }
            </>
        )
    }
}