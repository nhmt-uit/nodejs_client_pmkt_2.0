import React, {Component} from "react";
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

import { getBanker } from "my-actions/banker/BankerAction";


class BankerListContainer extends React.Component{
    render() {
        return(
            <div>
                CONTENT ABC
            </div>
        )
    }
}

const mapStateToProps = state => {
    console.log("State", state)
    let initialValues = {};
    if(state.form.banker){
        initialValues = state.form.banker.values;
    }
    return {initialValues, auth: state.AuthReducer}
}

const mapDispatchToProps = (dispatch) => {
    return {
        getBanker: params => {dispatch(getBanker(params))}
    }
}

export default compose(
    reduxForm({form: 'banker'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation()
)(BankerListContainer);