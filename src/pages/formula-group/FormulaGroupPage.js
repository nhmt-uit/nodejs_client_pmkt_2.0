import React, {Component} from 'react'

import { TransComponent } from 'my-components';
import { FormulaGroupListContainer, CreateFormulaGroupContainer} from 'my-containers/formula-group'

class FormulaGroupPage extends Component{
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption bold uppercase font-size-15"><TransComponent i18nKey="formula group" /></div>
                </div>
                <div className="portlet-body">
                    <CreateFormulaGroupContainer/>
                </div>
                <div className="portlet-body">
                    <FormulaGroupListContainer />
                </div>
            </div>
        );
    }
}

export default FormulaGroupPage;