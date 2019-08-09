import React, {Component} from 'react';

import { ListUserContainer } from 'my-containers/admin/set-feature';
import { TransComponent } from 'my-components';

class SetFeaturePage extends Component {
    render() {
        return (
            <div className="portlet light bordered" id="portlet-set-feature">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Add Features" /></div>
                </div>
                <div className="portlet-body">
                    <ListUserContainer />
                </div>
            </div>
        );
    }
}

export default SetFeaturePage;