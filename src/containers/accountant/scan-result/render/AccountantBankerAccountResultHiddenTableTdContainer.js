import React, { Component } from 'react';
import { isEqual as _isEqual, isEmpty as _isEmpty } from 'lodash'

import { TransComponent } from 'my-components'


class AccountantBankerAccountResultHiddenTableTdContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.dataHiddenFields, this.props.dataHiddenFields)
            || !_isEqual(newProps.formula, this.props.formula)
            )
            return true
        return false;
    }
    
    render() {
        const { dataHiddenFields, formula } = this.props
        return (
            <>
                {
                    !_isEmpty(formula) ?
                        (
                            <>
                            {dataHiddenFields.formatName ? <td className={formula.PRText + " column-hidden"}>{formula.formatName}</td> : null} {/* formatName */}
                            {dataHiddenFields.he_so ? <td className={formula.PRText + " column-hidden text-right"}>{formula.he_so}</td> : null}  {/* he_so */}
                            {dataHiddenFields.gia_thau ? <td className={formula.PRText + " column-hidden text-right"}>{formula.gia_thau}</td> : null} {/* gia_thau */}
                            {dataHiddenFields.PRText ? <td className={formula.PRText + " column-hidden"}>{formula.PRText === 'rec' ? <TransComponent i18nKey="Receive" /> : <TransComponent i18nKey="Pay" />}</td> : null} {/* PRText */}
                            </>
                        )
                    : (
                        <>
                        {dataHiddenFields.formatName ? <td className="column-hidden" /> : null} {/* formatName */}
                        {dataHiddenFields.he_so ? <td className="column-hidden" /> : null}  {/* he_so */}
                        {dataHiddenFields.gia_thau ? <td className="column-hidden" /> : null} {/* gia_thau */}
                        {dataHiddenFields.PRText ? <td className="column-hidden" /> : null} {/* PRText */}
                        </>
                    )
                }
            </>
        )
    }
}

export default AccountantBankerAccountResultHiddenTableTdContainer