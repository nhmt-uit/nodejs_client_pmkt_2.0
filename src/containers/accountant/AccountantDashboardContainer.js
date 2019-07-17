import React, {Component} from 'react';
import { Route, Link } from "react-router-dom";
import { CookieService } from 'my-utils/core';

import { menus } from 'my-pages/layouts/partials/MainNavigation';
import { TransComponent } from 'my-components'

/*===============================
 * Custom HTML Link Router
 * ==============================*/
const SelectMenuLink = ({ menu }) => (
    <Route
        path={menu.to}
        exact={menu.exact}
        children={
            ({ match }) => {
                return (
                    <div className="col-md-4">
                        <Link
                            to={menu.to}
                            className="btn-tile"
                        >
                            <div><i className={menu.icon}></i></div>
                            <div><TransComponent i18nKey={menu.name} /></div>
                        </Link>
                    </div>
                )
            }
        }
    />
);

class AccountantDashboardContainer extends Component {

    /*====================================
     * Initial Menu Elements
     *====================================*/
    initMenus(menus) {
        const roles = CookieService.get("roles");
        const status = CookieService.get("status");
        let xhtml = null
        let manageMenu = menus[1];
        if (manageMenu && manageMenu.sub_menus && manageMenu.sub_menus.length) {
            xhtml = manageMenu.sub_menus.map((menu, index) => {
                if(menu.roles.indexOf(Number(roles)) === -1 || Number(status) === 0) return null
                return (
                    <SelectMenuLink key={index} menu={menu} />
                )
            })
        }
        return xhtml
    }

    render() {
        return (
            <div>
                {this.initMenus(menus)}
            </div>
        );
    }
}

export default AccountantDashboardContainer