import React, {Component} from "react";

import { AuthService } from 'my-services/systems'
import { CookieService } from 'my-utils/core'
import { TransComponent } from 'my-components'

class InfoUserContainer extends Component {
    render() {
        const username = AuthService.getUsername();
        const expires = AuthService.getExpires();
        const status = CookieService.get("status");

        return (
            <div className="col-md-4 hide-on-mobile" style={{paddingTop: "10px", fontSize: '12px'}}>
                <div className="font-white"><span><TransComponent i18nKey="hello: " /> </span><span> {username} </span></div>
                {
                    Number(status) === 1 ?
                        <div className="font-white"><span><TransComponent i18nKey="expires day: " /> </span><span> {expires} </span></div>
                        : null
                }
            </div>
        );
    }
}

export default InfoUserContainer