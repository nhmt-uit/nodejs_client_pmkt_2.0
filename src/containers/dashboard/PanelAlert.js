import React, {Component} from 'react';
import {connect} from "react-redux";
import { get as _get, isEmpty as _isEmpty} from 'lodash'

import {getAlert} from "my-actions/systems/AlertAction";
import { TransComponent } from 'my-components'

class PanelAlert extends Component{
    componentWillMount() {
        this.props.getAlert()
    }

    render() {
        const DATA = _get(this.props, "alert.payload")
        if(_isEmpty(DATA)){
            return null;
        }
        var List = DATA.res.data;
        return (
            <div className="row widget-row">
                <div className="col-xs-6">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="col-xs-9 caption">
                                <i className="icon-social-dribbble font-green hide"></i>
                                <span className="caption-subject font-dark bold uppercase"> <TransComponent i18nKey="Overview" /></span>
                            </div>
                            <div>
                                <ul className="col-xs-3 nav nav-tabs">
                                    <li>
                                        <i className="fa fa-minus font-green-haze"></i>
                                        <span> <TransComponent i18nKey="Turnover" /></span>
                                    </li>
                                    <li>
                                        <i className="fa fa-minus font-yellow-casablanca"></i>
                                        <span> <TransComponent i18nKey="Tickets" /></span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="mt-btm-transform">
                                Content OVERVIEW
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col-xs-6">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="caption">
                                <i className="icon-social-dribbble font-green hide"></i>
                                <span className="caption-subject font-dark bold uppercase"> <TransComponent i18nKey="Alert" /></span>
                            </div>
                        </div>
                        <div className="portlet-body table-scrollable" style={{maxHeight:"400px", overflowY: 'scroll'}}>
                            <div className="mt-btm-transform ">
                                {/*====================================================================*/}
                                {List.map(function (items) {
                                    return(
                                        <div className="portlet box blue-hoki" key={items.created}>
                                            <div className="portlet-title">
                                                <div className="caption">
                                                    <i className="fa fa-newspaper-o"></i> {items.created_format}
                                                </div>
                                            </div>
                                            <div className="portlet-body">
                                                <div id="sample_3_wrapper" className="dataTables_wrapper no-footer">
                                                    <div className="row">
                                                        <div className="col-md-12">
                                                            {/*Render HTML string as real HTML in a React component*/}
                                                            <div key={items.id} dangerouslySetInnerHTML={{ __html: items.name }} />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                {/*====================================================================*/}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}


const mapDispatchToProps = (dispatch) => {
    return {
        getAlert: params => {dispatch(getAlert(params))}
    }
};

export default connect(null, mapDispatchToProps)(PanelAlert)