import React, { Component } from 'react';
import { TransComponent } from 'my-components';

import { HostFormContainer, HostListContainer } from 'my-containers/admin/host'

class HostPage extends Component {

    toggleEditHost = item => {
        this.child.callHostForm(item)
    }

    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Host"/></div>
                </div>
                <div className="portlet-body">
                    <div className="row">
                        <div className="col-md-4">
                            <HostFormContainer onRef={ref => (this.child = ref)} />
                        </div>
                        <div className="col-md-8">
                            <HostListContainer onToggleEditHost={this.toggleEditHost}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default HostPage;