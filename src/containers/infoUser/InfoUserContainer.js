import React, {Component} from "react";
import {compose} from "redux";
import {withTranslation} from "react-i18next";

import { AuthService } from 'my-services/systems'


class InfoUserContainer extends Component {
    render() {
        const { t } = this.props;

        var username = AuthService.getUsername();
        var expires = AuthService.getExpires();
        // console.log("Info USER", username, expires)
        return (
            <div>
                <div className="col-xs-4">
                    <div className="font-white bold"><span>{t("Hello:")} </span><span> {username} </span></div>
                    <div className="font-white bold"><span>Expires day: </span><span> {expires} </span></div>
                </div>
            </div>
        );
    }
}

export default compose(
    withTranslation(),
)(InfoUserContainer);