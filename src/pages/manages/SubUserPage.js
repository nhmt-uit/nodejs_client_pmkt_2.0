import React, {Component} from "react";
import ListSubUserContainer from 'my-containers/user_sub/ListSubUserContainer';
import CreateSubUserContainer from 'my-containers/user_sub/CreateSubUserContainer';
import {TransComponent} from 'my-components'

class SubUserPage extends Component{
    render() {
        return (
            <div className='portlet light bordered'>
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            <TransComponent i18nKey="create sub" />
                        </span>
                    </div>
                </div>
                <div className="portlet-body">
                    <div className="row">
                        <CreateSubUserContainer/>
                        <ListSubUserContainer/>
                    </div>
                </div>
            </div>
        );
    }
}

export default SubUserPage;