import React, {Component} from 'react'
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import Select from 'react-select';

import { getMember } from "my-actions/member/MemberAction";
import { isEmpty} from 'lodash'

class MemberContainer extends Component {
    constructor(props){
        super(props);
        this.state = {
            selectedMember: this.props.selectedMember,
        }
        this.handleMemberChange = this.handleMemberChange.bind(this);
    }
    componentWillMount() {
        this.props.getMember()
    }

    handleMemberChange(e){
        this.setState({
            selectedMember : e.target.value,
        })
        this.props.changeSelectedMember(e.target.value)
    }

    render() {
        var DATA_MEMBER = this.props.memberList.member;
        if(isEmpty(DATA_MEMBER)){
            return null;
        }
        var listMember = DATA_MEMBER.res.data.List;

        var optionMember = listMember.map(function (item) {
            return(
                <option key={item.id} value={item.id}> {item.fullname.toUpperCase()} </option>
            )
        })

        return (
            <select value={this.props.selectedMember} onChange={this.handleMemberChange}>
                <option value="Select Member"> -- Select Member -- </option>
                {optionMember}
            </select>
        );
    }
}

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