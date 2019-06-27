import React, {Component} from 'react'
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";

import { getMember } from "my-actions/member/MemberAction";
import { isEmpty} from 'lodash'

class MemberContainer extends Component {
    componentWillMount() {
        this.props.getMember()
    }

    render() {
        var DATA_MEMBER = this.props.memberList.member;
        if(isEmpty(DATA_MEMBER)){
            return null;
        }
        var ListMember = DATA_MEMBER.res.data.List;
        console.log("LIST MEMBER", ListMember)

        var OptionMember = ListMember.map(function (item) {
            return(
                <label key={item.id} className="mt-radio mt-radio-outline">
                    <input type="radio" name={item.name} id={item.name} value={item.name}/>
                    {item.name}
                    <span></span>
                </label>
            )
        })

        return (
            <div>
                <div className="col-md-8">
                    <select>
                        <option value="Select cycle"> Select cycle </option>
                        {OptionMember}
                    </select>
                </div>
            </div>
        );
    }
}
//checked={this.state.selectedMoney === item.name} onChange={this.handleMoneyChange}
// value={this.state.selectedCycle} onChange={this.handleCycleChange}
const mapStateToProps = state => {
    let initialValues = {};
    if(state.form.member){
        initialValues = state.form.member.values;
    }
    return {initialValues, auth: state.AuthReducer, memberList: state.member}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getMember: params => {dispatch(getMember(params))}
    }
};

export default compose(
    reduxForm({form:'member'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(MemberContainer)