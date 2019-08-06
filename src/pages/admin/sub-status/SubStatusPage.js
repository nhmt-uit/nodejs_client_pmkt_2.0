import React, {Component} from 'react';

import { SubStatusContainer } from 'my-containers/admin/sub-status';
import { TransComponent } from 'my-components';

class SubStatusPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Sub status management" /></div>
                </div>
                <div className="portlet-body">
                    <SubStatusContainer />
                </div>
            </div>
        );
    }
}

export default SubStatusPage;