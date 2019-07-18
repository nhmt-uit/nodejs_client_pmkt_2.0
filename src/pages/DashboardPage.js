import React, { Component } from 'react';
import {TransComponent} from 'my-components'

import { QuickActivitiesContainer, PanelAlert } from "my-containers/dashboard"
import { CookieService } from 'my-utils/core'

class DashboardPage extends Component {
    
    render() {
        const status = CookieService.get("status");

        return (
            <div className='portlet light bordered'>
                <div className="portlet-title">
                    <div className="caption font-red-sunglo">
                        <span className="caption-subject bold uppercase">
                            <TransComponent i18nKey="Dashboard" />
                        </span>
                    </div>
                </div>
                <div className="portlet-body form">
                    {
                        Number(status) === 1 ? <QuickActivitiesContainer /> : null
                    }
                    <div className="row widget-row">
                        <div className="col-md-3">
                            {/* BEGIN WIDGET THUMB */}
                            <div className="widget-thumb widget-bg-color-white text-uppercase margin-bottom-20 bordered">
                                <h4 className="widget-thumb-heading"><TransComponent i18nKey="Total Users"/></h4>
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
                                <h4 className="widget-thumb-heading"><TransComponent i18nKey="Total Tickets"/></h4>
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
                                <h4 className="widget-thumb-heading"><TransComponent i18nKey="Last week win/loose"/></h4>
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
                                <h4 className="widget-thumb-heading"><TransComponent i18nKey="Last week income"/></h4>
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
                </div>
            </div>
        );
    }
}

export default DashboardPage