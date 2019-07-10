import React, { Component } from 'react';

import { ListMemberContainer, DetailMemberContainer } from 'my-containers/member'
import {TransComponent} from 'my-components'

class MemberPage extends Component {
    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            <TransComponent i18nKey="Member" />
                        </span>
                    </div>
                </div>
                <div className="portlet-body form">
                    <div className="row">
                        <div className="col-md-4">
                            <ListMemberContainer />
                        </div>
                        <div className="col-md-8">
                            <DetailMemberContainer />
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default MemberPage;