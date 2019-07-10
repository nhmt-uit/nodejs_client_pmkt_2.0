import React, { Component } from 'react';
import {Link} from "react-router-dom";
import { RoutesService } from 'my-routes';

import { TransComponent } from 'my-components'

class QuickActivitiesContainer extends Component {
    render() {
        return (
            <div className="portlet light bordered text-center">
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-settings font-green-sharp" />
                        <span className="caption-subject font-green-sharp bold uppercase"><TransComponent i18nKey="Quick Activities" /></span>
                    </div>
                </div>
                <div className="portlet-body">
                    <Link to={RoutesService.getPath('ADMIN', 'MANAGE_CREATE_NEW')} className="icon-btn">
                        <i className="fa fa-plus" />
                        <div><TransComponent i18nKey="Add new" /> </div>
                    </Link>
                    <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT')} className="icon-btn">
                        <i className="fa fa-list" />
                        <div><TransComponent i18nKey="Report" /></div>
                    </Link>
                    <Link to="/winloss" className="icon-btn">
                        <i className="fa fa-usd" />
                        <div><TransComponent i18nKey="win/lose" /></div>
                    </Link>
                    <Link to="/outstanding" className="icon-btn">
                        <i className="fa fa-server" />
                        <div><TransComponent i18nKey="Outstanding" /></div>
                    </Link>
                    <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_LIST')} className="icon-btn">
                        <i className="fa fa-calculator" />
                        <div><TransComponent i18nKey="Accountant" /></div>
                    </Link>
                </div>
            </div>
        );
    }
}

export default QuickActivitiesContainer