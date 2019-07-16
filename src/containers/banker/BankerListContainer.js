import React from "react";
import {compose} from "redux";
import {reduxForm} from "redux-form";
import {connect} from "react-redux";
import { getBanker } from "my-actions/banker/BankerAction";
import {TransComponent, LoadingComponent} from 'my-components'

import { isEmpty} from 'lodash'

class BankerListContainer extends React.Component{
    componentWillMount() {
        this.props.getBanker()
    }

    render() {
        var DATA = {};
        DATA = this.props.bankerList.payload;
        if(isEmpty(DATA)){
            return (
                <div style={{ height: '100px' }}><LoadingComponent /></div>
            );
        }
        var List = DATA.res.data.List;
        return(
            <div className="col-md-12 portlet light bordered">
                <div className="table-responsive">
                    <table className="table table-striped table-bordered table-hover dataTable no-footer dtr-inline">
                        <thead></thead>
                        <tbody>
                        {
                            List.length ?
                            List.map(function (items) {
                            var url = items.logo.replace(".", "")
                            return(
                                <tr key={items.name} role="row" className="odd">
                                    <td><img src={"/assets" + url} alt={items.name} style={{height:60, width:120}} /></td>
                                    <td>
                                        {
                                            items.agent_url.map(item => {
                                                return(
                                                    <div key={'item_url'+item}>
                                                        <a href={item} target="_blank" rel="noopener noreferrer"> {item} </a>
                                                    </div>
                                                )
                                            })
                                        }
                                    </td>
                                </tr>
                            )})
                            : <tr><td className="text-center" colSpan="20"><TransComponent i18nKey="Data Empty" /></td></tr>
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

const mapStateToProps = state => {
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
)(BankerListContainer);