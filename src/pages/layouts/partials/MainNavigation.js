import React, { Component } from 'react';
import { Route, Link } from "react-router-dom";

import { RoutesService } from 'my-routes';


const menus = [
    { to: RoutesService.getPath('ADMIN', 'DASHBOARD'), exact: true, name: 'Dashboard', icon: 'fa fa-pie-chart'},
    { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_DASHBOARD'), exact: false, name: 'Accountant', icon: 'fa fa-bar-chart',
        sub_menus: [
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_LIST'), exact: true, name: 'Accountant' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL'), exact: true, name: 'Accountant Manual' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'), exact: true, name: 'Report' },
        ],
    },
    { to: RoutesService.getPath('ADMIN', 'MANAGE_DASHBOARD'), exact: false, name: 'Manage', icon: 'fa fa-gears',
        sub_menus: [
            { to: RoutesService.getPath('ADMIN', 'CONFIGURATION'), exact: true, name: 'Configuration' },
            { to: RoutesService.getPath('ADMIN', 'FORMULA'), exact: true, name: 'Formular' },
            { to: RoutesService.getPath('ADMIN', 'FORMULA_GROUP'), exact: true, name: 'Formula Group' },
            { to: RoutesService.getPath('ADMIN', 'MEMBER'), exact: true, name: 'Member' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNT'), exact: true, name: 'Account' },
            { to: RoutesService.getPath('ADMIN', 'ACCOUNT_SUB'), exact: true, name: 'Create Sub' },
        ],
    },
]

/*===============================
 * Custom HTML Link Router
 * ==============================*/
const MenuLink = ({ menu }) => (
    <Route
        path={menu.to}
        exact={menu.exact}
        children={
            ({ match }) => {
                let active = (match) ? "active" : ""
                let sub_menus = ""
                if(typeof menu.sub_menus!== "undefined") {
                    sub_menus = menu.sub_menus.map((menu, index) => {
                        return (
                            <SubMenuLink key={index} menu={menu} />
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
                            <span className="title">{menu.name}</span>
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
);

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
                            <span className="title">{menu.name}</span>
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
        let xhtml = null
        if (menus.length) {
            xhtml = menus.map((menu, index) => {
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