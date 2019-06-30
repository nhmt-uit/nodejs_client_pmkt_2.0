
import React, {Component} from 'react'
import {connect} from "react-redux";
import { isEmpty as _isEmpty} from 'lodash'
import { Link } from 'react-router-dom'

import { getBankerByMember } from "my-actions/banker/BankerAction";
import { TransComponent } from 'my-components'
import { RoutesService } from 'my-routes'

class AccountantManualBankerPage extends Component {

    componentWillMount() {
        this.props.getBankerByMember()
    }

    render() {
        const DATA = this.props.payloadByMember;
        if(_isEmpty(DATA)) return null
        var List = DATA.res.data.List;
        var item = List.map(function (item, index) {
            return (
                <div key={index} className="col-xs-4 col-md-4">
                    <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', {bankerName: item.name.toLowerCase(), type: 'login' })} >
                        <div className="widget-thumb margin-bottom-20 bordered">
                            <div className="widget-thumb-wrap text-center">
                                <img src={"/assets/images/logo/" + item.logo} alt={item.name} title={item.name} style={{height:33, width:"auto"}}/>
                            </div>
                        </div>
                    </Link>
                </div>
            )
        })

        return (
            <div className="row">
                <div className="portlet light bordered" style={{marginLeft: 15, marginRight:15}}>
                    <div className="caption font-red-sunglo"><h4><span className="caption-subject bold uppercase"><TransComponent i18nKey="Accountant Manual" /></span></h4></div>
                    <div className="tools"><span className="collapse"> </span></div>
                </div>

                <div className="col-xs-12">
                    <h5 className="margin-bottom"> <TransComponent i18nKey="Please chooose company to login: " /></h5>
                    <div className="row widget-row">
                        {item}
                    </div>
                </div>
            </div>
        )
    }
}
const mapStateToProps = state => {
    return {
        payloadByMember: state.banker.payloadByMember
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        getBankerByMember: params => {dispatch(getBankerByMember(params))}
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(AccountantManualBankerPage)