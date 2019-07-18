import React, { Component } from 'react';

import { FormulaListContainer } from 'my-containers/formula';
import { TransComponent } from 'my-components';

export default class FormulaPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Formula" /></div>
                </div>
                <div className="portlet-body">
                    <FormulaListContainer />
                </div>
            </div>
        );
    }
}
