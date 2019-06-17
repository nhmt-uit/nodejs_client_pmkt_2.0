import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import {reduxForm} from "redux-form";
import { getInfoUser } from "my-actions/infoUser/InfoUserAction";


class InfoUserContainer extends Component {
    componentWillMount() {
        this.props.getInfoUser()
    }

    render() {

        console.log("GET INFO USER", this.props)
        return (
            <div>

            </div>
        );
    }
}

const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.info_user){
        initialValues = state.form.info_user.values;
    }
    return {initialValues, auth: state.AuthReducer, infoUser: state.info_user}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getInfoUser: params => {dispatch(getInfoUser(params))}
    }
};

export default compose(
    reduxForm({form: 'info_user'}),
    connect (mapStateToProps, mapDispatchToProps),
    withTranslation()
)(InfoUserContainer);