import React, { Component } from 'react';

import { TransComponent } from 'my-components';

class LanguagePage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Language"/></div>
                </div>
                <div className="portlet-body">
                </div>
            </div>
        );
    }
}

export default LanguagePage;