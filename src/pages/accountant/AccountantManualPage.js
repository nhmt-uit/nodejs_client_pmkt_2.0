import React, {Component} from 'react'
import {compose} from "redux";
import {connect} from "react-redux";
import {withTranslation} from "react-i18next";
import { getBanker } from "my-actions/banker/BankerAction";
import { isEmpty} from 'lodash'
import {reduxForm} from "redux-form/es/immutable";
import MultiSelect from "../../containers/accountant/AccountantFormScanContainer";


class AccountantManualPage extends Component {
    componentWillMount() {
        this.props.getBanker()
    }

    render() {
        const { t } = this.props;

        var DATA = this.props.bankerList.payload;
        if(isEmpty(DATA)){
            return null;
        }
        var List = DATA.res.data.List;
        console.log("TEST LIST", List)
        var item = List.map(function (item, index) {
            var url = item.logo.replace(".","");
            return(
                <div key={index} className="col-xs-4 col-md-4">
                    <a href="#">
                        <div className="widget-thumb margin-bottom-20 bordered">
                            <div className="widget-thumb-wrap">
                                <img src={"/assets" + url} alt={item.name} title={item.name} style={{height:60, width:140}}/>
                            </div>
                        </div>
                    </a>
                </div>
            )
        })

        return (
            <div>
                <div className="row">
                    <div className="portlet light bordered" style={{marginLeft: 15, marginRight:15}}>
                        <div className="caption font-red-sunglo"><h4><span className="caption-subject bold uppercase">{t("Accountant Manual")}</span></h4></div>
                        <div className="tools"><span className="collapse"> </span></div>
                    </div>

                    <div className="col-xs-12">
                        <h5 className="margin-bottom"> {t("Please chooose company to login: ")}</h5>
                        <div className="row widget-row">
                            {item}
                        </div>
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
)(AccountantManualPage);