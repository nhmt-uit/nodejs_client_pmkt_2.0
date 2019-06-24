import React from "react";
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import { getBanker } from "my-actions/banker/BankerAction";

import { isEmpty} from 'lodash'

class BankerListContainer extends React.Component{
    componentWillMount() {
        this.props.getBanker()
    }

    render() {
        var DATA = {};
        DATA = this.props.bankerList.payload;
        // console.log("DATA:", typeof DATA);
        if(isEmpty(DATA)){
            console.log("DATA is empty!")
            return null;
        }
        var List = DATA.res.data.List;
        console.log("LIST", List)
        return(
            <div>
                <div className="col-xs-12 portlet light bordered">
                    <div className="table-scrollable">
                        <table className="table table-hover">
                            <tbody>
                            {List.map(function (items) {
                                var url = items.logo.replace(".", "")
                                return(
                                    <tr key={items.name}>
                                        <td><img src={"/assets" + url} alt={items.name} style={{height:60, width:120}} /></td>
                                        <td><a href={items.member_url} target="_blank" rel="noopener noreferrer"> {items.member_url} </a> </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>


        )
    }
}

const mapStateToProps = state => {
    console.log("State banker", state);
    let initialValues = {};
    if(state.form.banker){
        initialValues = state.form.banker.values;
    }
    return {initialValues, auth: state.AuthReducer, bankerList: state.banker}
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBanker: params => {dispatch(getBanker(params))}
    }
};

export default compose(
    reduxForm({form: 'banker'}),
    connect(mapStateToProps, mapDispatchToProps),
    withTranslation(),
)(BankerListContainer);