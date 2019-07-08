import React, {Component} from 'react'
import {TransComponent} from 'my-components'
import {RoutesService} from 'my-routes';
import {Link} from "react-router-dom";


class ButtonBackTransaction extends Component {
    render() {
        return (
            <Link to={RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT')} className="btn btn-default mt-ladda-btn ladda-button btn-outline btn-circle">
                <span className="ladda-label"><TransComponent i18nKey="Back" /></span>
                <span className="ladda-spinner"></span>
            </Link>
        )
    }
}

export default ButtonBackTransaction;