import React, { Component, Fragment } from 'react';
import { isEqual as _isEqual } from 'lodash'

import { TransComponent } from 'my-components'

class AccountantBankerAccountResultHiddenTableThContainer extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.dataHiddenFields, this.props.dataHiddenFields))
            return true
        return false;
    }
    
    render() {
        const { dataHiddenFields } = this.props
        return (
            <>
                {dataHiddenFields.formatName ? <th className="column-hidden"><TransComponent i18nKey="Type" /></th> : null} {/* formatName */}
                {dataHiddenFields.he_so  ? <th className="column-hidden"><TransComponent i18nKey="Ratio" /></th> : null}  {/* he_so */}
                {dataHiddenFields.gia_thau  ? <th className="column-hidden"><TransComponent i18nKey="Price" /></th> : null} {/* gia_thau */}
                {dataHiddenFields.PRText  ? <th className="column-hidden"><TransComponent i18nKey="Pay/Rec" /></th> : null} {/* PRText */}
            </>
        )
    }
}



export default AccountantBankerAccountResultHiddenTableThContainer