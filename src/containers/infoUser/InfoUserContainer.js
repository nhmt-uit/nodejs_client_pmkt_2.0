import React, {Component} from "react";
import {compose} from "redux";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import {reduxForm} from "redux-form";
import { getInfoUser } from "my-actions/infoUser/InfoUserAction";
import { isEmpty} from 'lodash'


class InfoUserContainer extends Component {
    componentWillMount() {
        this.props.getInfoUser()
    }

    render() {
        var DATA = {};
        DATA = this.props.infoUser.payload;
        if( isEmpty(DATA)){
            return null;
        }
        var infoUser =  DATA.res.data.userInfo;
        console.log("info User", infoUser)
        var List = null;
        return (
            <div>
                <div className="col-xs-4">
                    <div className="font-white bold"><span lang="Hello:">Hello: </span><span> {infoUser.username} </span></div>
                    <div className="font-white bold"><span lang="Expires day: ">Expires day: </span><span> {infoUser.ep} </span></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("State info user", state);
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
    withTranslation(),
)(InfoUserContainer);