import React, {Component} from 'react';

import { LogChangePasswordContainer } from 'my-containers/admin/log-change-password';
import { TransComponent } from 'my-components';

class LogChangePasswordPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Log Change Pass" /></div>
                </div>
                <div className="portlet-body">
                    <LogChangePasswordContainer />
                </div>
            </div>
        );
    }
}

export default LogChangePasswordPage;