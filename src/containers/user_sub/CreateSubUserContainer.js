import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {TransComponent} from 'my-components'

import { createMemberSub, getMemberSub, toggleModalMemberSub, getSuffixesMember} from 'my-actions/account_sub/AccountSubAction'
import ModalFormCreateSubUserContainer from './ModalFormCreateSubUserContainer'

class CreateSubUserContainer extends Component {
    constructor(props){
        super(props)
        this.state = {
            isOpenModal: false,
        }
    }

    render() {
        return (
            <div className="col-md-12">
                <div className="form-group text-right">
                    <a type="submit" className="btn btn-default red" onClick={() => this.props.toggleModalMemberSub()}><TransComponent i18nKey="Add new"/></a>
                </div>
                <div className="clearfix"></div>
                <ModalFormCreateSubUserContainer/>
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