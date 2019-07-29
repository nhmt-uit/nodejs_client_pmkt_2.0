import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";

import {isEqual} from "lodash";
import { RoutesService } from 'my-routes';
import { CookieService } from 'my-utils/core';
import { TransComponent } from 'my-components'


export const menus = [
    { to: RoutesService.getPath('ADMIN', 'DASHBOARD'), roles: [0, 10, 11, 12], exact: true, name: 'Dashboard', icon: 'fa fa-pie-chart'},
    { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_DASHBOARD'), roles: [10, 11, 12], exact: false, name: 'Accountant', icon: 'fa fa-bar-chart',
        sub_menus: [
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_LIST'), roles: [10], exact: true, name: 'Accountant', icon: 'fa fa-bar-chart' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL'), roles: [10], exact: false, name: 'Accountant Manual', icon: 'fa fa-line-chart' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'), roles: [10, 11, 12], exact: false, name: 'Report', icon: 'fa fa-calendar-check-o' },
        ],
    },
    { to: RoutesService.getPath('ADMIN', 'MANAGE_DASHBOARD'), roles: [10], exact: false, name: 'Manage', icon: 'fa fa-gears',
        sub_menus: [
            { to: RoutesService.getPath('ADMIN', 'MANAGE_CREATE_NEW'), roles: [10], exact: true, name: 'create new', icon: 'fa fa-user-plus' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_CONFIGURATION'), roles: [10], exact: true, name: 'Configuration', icon: 'fa fa-cog' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_FORMULA'), roles: [10], exact: true, name: 'Formula', icon: 'fa fa-sliders' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_FORMULA_GROUP'), roles: [10], exact: true, name: 'formula group', icon: 'fa fa-sliders' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_MEMBER'), roles: [10], exact: true, name: 'Member', icon: 'fa fa-users' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_ACCOUNT'),roles: [10],  exact: true, name: 'Account', icon: 'fa fa-user' },
            { to: RoutesService.getPath('ADMIN', 'MANAGE_ACCOUNT_SUB'), roles: [10], exact: true, name: 'create sub', icon: 'fa fa-user-plus' },
        ],
    },
]

/*===============================
 * Custom HTML Link Router
 * ==============================*/
const MenuLink = ({ menu }) => {
    const roles = CookieService.get("roles");
    const status = CookieService.get("status");
    return (
        <Route
            path={menu.to}
            exact={menu.exact}
            children={
                ({match}) => {
                    let active = (match) ? "active" : ""
                    let sub_menus = ""
                    if (typeof menu.sub_menus !== "undefined") {
                        sub_menus = menu.sub_menus.map((menu, index) => {
                            if(menu.roles.indexOf(Number(roles)) === -1 || Number(status) === 0) return null
                            return (
                                <SubMenuLink key={index} menu={menu}/>
                            )
                        })
                    }

                    return (
                        <li className={`nav-item ${active}`}>
                            <Link
                                to={menu.to}
                                className="nav-link text-uppercase text-expanded"
                            >
                                <i className={menu.icon}></i>
                                <span className="title"><TransComponent i18nKey={menu.name}/></span>
                                {sub_menus ? <span className="arrow"></span> : ""}
                            </Link>
                            {sub_menus ? <ul className="sub-menu">
                                {sub_menus}
                            </ul> : ""}
                        </li>
                    )
                }
            }
        />
    )
}

/*===============================
 * Custom HTML Link Router
 * ==============================*/
const SubMenuLink = ({ menu }) => (
    <Route
        path={menu.to}
        exact={menu.exact}
        children={
            ({ match }) => {
                let active = (match) ? "active" : ""
                return (
                    <li className={`nav-item ${active}`}>
                        <Link
                            to={menu.to}
                            className="nav-link"
                        >
                            <span className="title"><TransComponent i18nKey={menu.name} /></span>
                        </Link>
                    </li>
                )
            }
        }
    />
);
    
class MainNavigation extends Component {

    /*====================================
     * Initial Menu Elements
     *====================================*/
    initMenus(menus) {
        const roles = CookieService.get("roles");
        const status = CookieService.get("status");
        let xhtml = null
        if (menus.length) {
            xhtml = menus.map((menu, index) => {
                if(menu.roles.indexOf(Number(roles)) === -1 || Number(status) === 0) return null
                return (
                    <MenuLink key={index} menu={menu} />
                )
            })
        }
        return xhtml
    }

    render() {
        return (
            <div className="page-sidebar-wrapper">
                <div className="page-sidebar navbar-collapse collapse">
                    <ul className="page-sidebar-menu  page-header-fixed " data-keep-expanded="false" data-auto-scroll="true" data-slide-speed={200} style={{ paddingTop: 20 }}>
                        {this.initMenus(menus)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default MainNavigation;