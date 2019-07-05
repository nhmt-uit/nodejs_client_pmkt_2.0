import React, {Component} from "react";
import ListSubUserContainer from 'my-containers/user_sub/ListSubUserContainer';
import CreateSubUserContainer from 'my-containers/user_sub/CreateSubUserContainer';
import {TransComponent} from 'my-components'

class SubUserPage extends Component{
    render() {
        return (
            <div className="row">
                <div className="portlet light bordered" style={{marginLeft: 15, marginRight:15}}>
                    <div className="caption font-red-sunglo"><h4><span className="caption-subject bold uppercase"><TransComponent i18nKey="Sub account"/></span></h4></div>
                    <div className="tools"><span className="collapse"> </span></div>
                </div>
                <CreateSubUserContainer/>
                <ListSubUserContainer/>
            </div>
        );
    }
}

export default SubUserPage;