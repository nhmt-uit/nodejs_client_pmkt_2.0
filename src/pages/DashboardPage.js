import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { QuickActivitiesContainer, PanelAlert } from "my-containers/dashboard"

import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';
import {compose} from "redux/es/redux";
import {withTranslation} from "react-i18next";
// import CreateTransaction from "my-containers/report/transaction/CreateTransaction";
// import ListOfTransaction from "my-containers/report/transaction/ListOfTransaction";

class DashboardPage extends Component {
    
    render() {
        const { t } = this.props;

        if (!CookieService.get('isLogin')) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />
        }

        return (
            <section>
                {/*<ListOfTransaction/>*/}
                {/*<CreateTransaction/>*/}
                <QuickActivitiesContainer />
                <div className="row widget-row">
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading"> { t("Total User") } </h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-green icon-user" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="7,644">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading"> { t("Total Tickets") } </h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-red icon-layers" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="1,293">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading"> { t("Last week win/lose") } </h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value={815}>0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading"> { t("Last week income") } </h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value={815}>0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                </div>
                <PanelAlert/>
            </section>
        );
    }
}

export default compose(
    withTranslation(),
)(DashboardPage);