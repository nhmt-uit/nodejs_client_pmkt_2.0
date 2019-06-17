import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { QuickAtivitiesContainer, PanelAlert } from "my-containers/dashboard"
// import BankerListContainer from "my-containers/banker/BankerListContainer";
import InfoUserContainer from "my-containers/infoUser/InfoUserContainer";

import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';

class DashboardPage extends Component {
    
    render() {
        if (!CookieService.get('isLogin')) {
            return <Redirect to={RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })} />
        }

        return (
            <section>
                <QuickAtivitiesContainer />
                <InfoUserContainer/>
                {/*<BankerListContainer/>*/}
                <div className="row widget-row">
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Total User</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-green icon-user" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="7,644">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Total Tickets</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-red icon-layers" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value="1,293">0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Last week win/lose</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
                                    <span className="widget-thumb-body-stat" data-counter="counterup" data-value={815}>0</span>
                                </div>
                            </div>
                        </div>
                        {/* END WIDGET THUMB */}
                    </div>
                    <div className="col-md-3">
                        {/* BEGIN WIDGET THUMB */}
                        <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                            <h4 className="widget-thumb-heading">Last week income</h4>
                            <div className="widget-thumb-wrap">
                                <i className="widget-thumb-icon bg-purple icon-screen-desktop" />
                                <div className="widget-thumb-body">
                                    <span className="widget-thumb-subtitle">USD</span>
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

export default DashboardPage;