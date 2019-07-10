import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {TransComponent} from 'my-components'
import {renderError} from 'my-utils/components/redux-form/render-form'

import { createMemberSub, getMemberSub, toggleModalMemberSub, getSuffixesMember} from 'my-actions/account_sub/AccountSubAction'
import ModalFormSubUserContainer from './ModalFormSubUserContainer'

class CreateSubUserContainer extends Component {

    render() {
        const { t }  = this.props;
        return (
            <div className="col-md-12">
                <div className="form-group text-right">
                    <a type="submit" className="btn btn-default red" onClick={() => this.props.toggleModalMemberSub()}><TransComponent i18nKey="Add new"/></a>
                </div>
                <div className="clearfix"></div>
                <ModalFormSubUserContainer formType="create"/>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        isOpenModal: state.AccountSubReducer.isOpenModal,
        formSaveStatus: state.AccountSubReducer.formSaveStatus,
        formSaveResponse: state.AccountSubReducer.formSaveResponse,
    }
};

const mapDispatchToProps = dispatch => {
    return{
        createMemberSub: post => dispatch(createMemberSub(post)),
        getMemberSub: params => {dispatch(getMemberSub(params))},
        getSuffixesMember: params => dispatch(getSuffixesMember(params)),
        toggleModalMemberSub:  params => dispatch(toggleModalMemberSub(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(CreateSubUserContainer);