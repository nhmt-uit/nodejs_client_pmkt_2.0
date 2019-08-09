import React, { Component } from 'react';
import { TransComponent } from 'my-components';

import { NoticeFormContainer, NoticeListContainer } from 'my-containers/admin/notice'

class NoticePage extends Component {

    toggleEditNotice = item => {
        this.child.callNoticeForm(item)
    }

    render() {
        return (
            <div className="portlet light bordered">
                <div className="portlet-title">
                    <div className="caption font-red-sunglo bold uppercase font-size-15"><TransComponent i18nKey="Notice"/></div>
                </div>
                <div className="portlet-body">
                    <div className="row">
                        <div className="col-md-5">
                            <NoticeFormContainer onRef={ref => (this.child = ref)} />
                        </div>
                        <div className="col-md-7">
                            <NoticeListContainer onToggleEditNotice={this.toggleEditNotice}/>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default NoticePage;