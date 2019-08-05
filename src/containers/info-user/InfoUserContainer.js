import React, {Component} from "react";

import { AuthService } from 'my-services/systems'
import { CookieService } from 'my-utils/core'
import { TransComponent } from 'my-components'

class InfoUserContainer extends Component {
    render() {
        const username = AuthService.getUsername();
        const expires = AuthService.getExpires();
        const status = CookieService.get("status");
        const roles = CookieService.get("roles");

        return (
            <>
                {
                    (Number(roles) === 0) ? null :
                        <div className="col-md-4 hide-on-mobile" style={{paddingTop: "10px", fontSize: '12px'}}>
                            <div className="font-white"><span><TransComponent i18nKey="hello: " /> </span><span> {username} </span></div>
                            {
                                Number(status) === 0 || (Number(roles) === 11 || Number(roles) === 12 ) ?
                                    null :
                                    <div className="font-white"><span><TransComponent i18nKey="expires day: " /> </span><span> {expires} </span></div>
                            }
                        </div>
                }
            </>
        );
    }
}

export default InfoUserContainer