import React, { Component } from 'react';
import { connect } from 'react-redux'

import { ListMemberContainer, DetailMemberContainer } from 'my-containers/member'
import {TransComponent} from 'my-components'
import {resetStoreMember} from 'my-actions/member/MemberAction'

class MemberPage extends Component {
    componentWillUnmount() {
        this.props.resetStoreMember()
    }

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


const mapDispatchToProps = (dispatch) => {
    return {
        resetStoreMember: _ => {dispatch(resetStoreMember())},
    }
};

export default connect(null, mapDispatchToProps)(MemberPage);