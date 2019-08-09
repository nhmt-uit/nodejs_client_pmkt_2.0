import React, { Component } from 'react';
import { TransComponent } from 'my-components';

import {LanguageFormContainer, LanguageListContainer} from 'my-containers/admin/language'

class LanguagePage extends Component {
    handleToggleEditLanguage = item => {
        this.child.callLanguageForm(item)
    }

    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Language"/></div>
                </div>
                <div className="portlet-body">
                    <div className="row">
                        <div className="col-md-4">
                            <LanguageFormContainer onRef={ref => (this.child = ref)}/>
                        </div>
                        <div className="col-md-8">
                            <LanguageListContainer onToggleEditLanguage={this.handleToggleEditLanguage}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default LanguagePage;