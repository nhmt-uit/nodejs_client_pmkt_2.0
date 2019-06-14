import React, {Component} from 'react';
import {withTranslation} from "react-i18next";
import {compose} from "redux";

class PanelAlert extends Component{
    render() {
        const { t } = this.props;
        return (
            <div className="row widget-row">
                <div className="col-xs-6">
                    <div className="portlet light bordered">
                        <div className="portlet-title">
                            <div className="col-xs-9 caption">
                                <i className="icon-social-dribbble font-green hide"></i>
                                <span className="caption-subject font-dark bold uppercase"> {t("Overview")} </span>
                            </div>
                            <div>
                                <ul className="col-xs-3 nav nav-tabs">
                                    <li>
                                        <i className="fa fa-minus font-green-haze"></i>
                                        <span> {t("Turnover")} </span>
                                    </li>
                                    <li>
                                        <i className="fa fa-minus font-yellow-casablanca"></i>
                                        <span> {t("Tickets")} </span>
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
                                <span className="caption-subject font-dark bold uppercase"> {t("Alert")} </span>
                            </div>
                        </div>
                        <div className="portlet-body">
                            <div className="mt-btm-transform">
                                Content ALERT
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            )
    }
}

export default compose(
    withTranslation()
)(PanelAlert);