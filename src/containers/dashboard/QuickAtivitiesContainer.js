import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import {compose} from "redux";
import {Link} from "react-router-dom";


class QuickAtivitiesContainer extends Component {
    render() {
        const { t } = this.props;
        return (
            <div className="portlet light bordered text-center">
                <div className="portlet-title">
                    <div className="caption">
                        <i className="icon-settings font-green-sharp" />
                        <span className="caption-subject font-green-sharp bold uppercase">{t("Quick Activities")}</span>
                    </div>
                </div>
                <div className="portlet-body">
                    <Link to ="/create_new" className="icon-btn">
                        <i className="fa fa-plus" />
                        <div> {t("Add new")} </div>
                    </Link>
                    <Link to ="/report_detail" className="icon-btn">
                        <i className="fa fa-list" />
                        <div> {t("Report")} </div>
                    </Link>
                    <Link to ="/winloss" className="icon-btn">
                        <i className="fa fa-usd" />
                        <div> {t("Win / Lose")} </div>
                    </Link>
                    <Link to ="/outstanding" className="icon-btn">
                        <i className="fa fa-server" />
                        <div> {t("Outstanding")} </div>
                    </Link>
                    <Link to ="/accountant" className="icon-btn">
                        <i className="fa fa-calculator" />
                        <div> {t("Accountant")} </div>
                        {/*<span className="badge badge-info"> 12 </span>*/}
                    </Link>
                </div>
            </div>
        );
    }
}

export default compose(
    withTranslation()
)(QuickAtivitiesContainer);