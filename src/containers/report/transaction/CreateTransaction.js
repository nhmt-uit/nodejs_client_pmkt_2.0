import React, {Component} from 'react'
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {compose} from "redux";
import {withTranslation} from "react-i18next";

import {getCycle, getTypeOfMoney} from "my-actions/report/TransactionAction";

class CreateTransaction extends Component{
    componentWillMount() {
        this.props.getCycle()
        this.props.getTypeOfMoney()
    }

    render() {
        console.log("this props", this.props)
        return (
            <div>
                HELLO CREATE TRANSACTION!
            </div>
        );
    }
}

const mapStateToProps = state => {
    console.log("State cycle", state);
    let initialValues = {};
    // let typeOfMoney = {};
    if(state.form.transaction){
        initialValues = state.form.transaction.values;
    }
    // if(state.form.type_of_money){
    //     initialValues = state.form.type_of_money.values;
    // }
    return {initialValues, auth: state.AuthReducer, cycleList: state.transaction}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getCycle: params => {dispatch(getCycle(params))},
        getTypeOfMoney: params => {dispatch(getTypeOfMoney(params))},
    }
};

export default compose(
    reduxForm({form: 'transaction'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(CreateTransaction);