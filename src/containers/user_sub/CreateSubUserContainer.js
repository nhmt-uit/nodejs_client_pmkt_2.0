import React, {Component} from 'react'
import {compose} from "redux/es/redux";
import {connect} from "react-redux";

import {TransComponent} from 'my-components'

import { toggleModalMemberSub } from 'my-actions/account_sub/AccountSubAction'
import ModalFormCreateSubUserContainer from './ModalFormCreateSubUserContainer'

class CreateSubUserContainer extends Component {

    render() {
        return (
            <div className="col-md-12">
                <div className="form-group text-right">
                    <a href="#/" type="submit" className="btn btn-default red" onClick={() => this.props.toggleModalMemberSub()}><TransComponent i18nKey="Add new"/></a>
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
        toggleModalMemberSub:  params => dispatch(toggleModalMemberSub(params)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(CreateSubUserContainer);