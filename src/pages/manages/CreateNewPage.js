import React, { Component } from 'react';

import { TransComponent } from 'my-components'
import { FormAssignContainer, ListFormulaBasedAccountContainer } from 'my-containers/accountant'

class CreateNewPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            <TransComponent i18nKey="Create new" />
                        </span>
                    </div>
                </div>
                <div className="portlet-body form">
                    <div className="row">
                        <div className="col-md-4">
                            <FormAssignContainer />
                        </div>
                        <div className="col-md-8">
                            <ListFormulaBasedAccountContainer />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default CreateNewPage;