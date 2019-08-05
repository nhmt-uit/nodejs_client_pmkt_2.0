import React, {Component} from 'react';

import { CurrencyListContainer } from 'my-containers/admin/currency-type';
import { TransComponent } from 'my-components';

class CurrencyTypePage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Currency list" /></div>
                </div>
                <div className="portlet-body">
                    <CurrencyListContainer />
                </div>
            </div>
        );
    }
}

export default CurrencyTypePage;