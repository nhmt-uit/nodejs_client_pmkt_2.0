import React, {Component} from "react";

import { AuthService } from 'my-services/systems'
import { TransComponent } from 'my-components'

class InfoUserContainer extends Component {
    render() {
        const username = AuthService.getUsername();
        const expires = AuthService.getExpires();
        return (
            <div className="col-md-4" style={{paddingTop: "10px", fontSize: '12px'}}>
                <div className="font-white"><span><TransComponent i18nKey="hello: " /> </span><span> {username} </span></div>
                <div className="font-white"><span><TransComponent i18nKey="expires day: " /> </span><span> {expires} </span></div>
            </div>
        );
    }
}

export default InfoUserContainer