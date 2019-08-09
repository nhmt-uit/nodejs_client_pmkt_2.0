import React, { Component, Fragment } from 'react'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link, withRouter } from 'react-router-dom'

import { ZopimChat, Notification } from 'my-components/navigation'
import BankerListContainer from "my-containers/banker/BankerListContainer"
import { CookieService } from 'my-utils/core'
import { RoutesService } from 'my-routes'
import InfoUserContainer from "my-containers/info-user/InfoUserContainer"
import 'my-styles/reactstrap-modal.css'
import { changeLanguage } from 'my-actions/systems/LanguageAction'
import { AuthService } from 'my-services/systems'
import { TransComponent } from 'my-components'
import { AppConfig } from 'my-constants'

import 'my-styles/styles.css'

class Header extends Component {
    state = {
        isOpenModalBaner: false,
        lang: CookieService.get('lang')
    };

    handleLogout = _ => {
        AuthService.logout();

        if (this.props.isReplaceRouterLink) {
            window.location.href = RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' });
        } else {
            this.props.history.push(RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' }))
        }
        // window.location.reload()
    };

    handleChangeLanguage = type => () => {
        CookieService.set('lang', type)
        this.setState({lang: type})
        return this.props.changeLanguage(type)
    };

    toggleModalBanker = _ => {
        this.setState({ isOpenModalBaner: !this.state.isOpenModalBaner })
    };

    render() {
        const status = CookieService.get("status");
        const lang = this.state.lang;
        const isReplaceRouterLink = this.props.isReplaceRouterLink;
        const roles = CookieService.get("roles");

        return (
            <>
                <div className="page-header navbar navbar-fixed-top">
                    <div className="page-header-inner ">
                        <div className="page-logo">
                            {
                                isReplaceRouterLink
                                    ? (
                                        <a className="position-relative" href={RoutesService.getPath('ADMIN', 'DASHBOARD')} style={{height: '100%', lineHeight: '35px', color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                                            <span>VW3 Application</span>
                                            <span className="version-header position-absolute display-block font-size-11 font-silver">Ver: {AppConfig.VERSION_RELEASE}</span>
                                        </a>

                                    )
                                    : (
                                        <Link className="position-relative" to={RoutesService.getPath('ADMIN', 'DASHBOARD')} style={{height: '100%', lineHeight: '35px', color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                                            <span>VW3 Application</span>
                                            <span className="version-header position-absolute display-block font-size-11 font-silver">Ver: {AppConfig.VERSION_RELEASE}</span>
                                        </Link>
                                    )
                            }
                            <div className="menu-toggler sidebar-toggler"><span /></div>
                        </div>
                        <a className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse"><span></span></a>
                        {/*=========================================*/}
                        <InfoUserContainer/>
                        {/*=========================================*/}
                        <div className="top-menu">
                            <ul className="nav navbar-nav pull-right">
                                {
                                    Number(status) === 1 ?
                                    <>
                                        {
                                            Number(roles) === 0 ? null :
                                                <>
                                                    <li className="dropdown dropdown-document">
                                                        <a href="/assets/images/HDSD PMKT VERSION 3.3.pdf" target="_blank" className="dropdown-toggle">
                                                            <span className="fa fa-book"/> &nbsp;
                                                            <span className="hide-on-mobile"><TransComponent i18nKey="document for new features" /></span>
                                                        </a>
                                                    </li>
                                                    <ZopimChat />
                                                </>
                                        }
                                        <Notification />
                                        <li className="dropdown dropdown-extended dropdown-inbox" id="header_inbox_bar">
                                            <a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                                <i className="icon-globe" />
                                            </a>
                                            <ul className="width-auto dropdown-menu dropdown-menu-default">
                                                <li>
                                                    <ul className="dropdown-menu-list scroller" data-handle-color="#637283">
                                                        <li>
                                                            <a onClick={this.handleChangeLanguage('en')} className="padding-tb-10-important text-uppercase text-center padding-">
                                                                {(lang && lang.toLowerCase() === 'en') ? <i className="fa fa-check"/> : ''}&nbsp;&nbsp;<TransComponent i18nKey="english" />
                                                            </a>
                                                        </li>
                                                        <li>
                                                            <a onClick={this.handleChangeLanguage('vi')} className="padding-tb-10-important text-uppercase text-center">
                                                                {(lang && lang.toLowerCase() === 'vi') ? <i className="fa fa-check"/> : ''}&nbsp;&nbsp;<TransComponent i18nKey="vietnam" />
                                                            </a>
                                                        </li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                        {/*=========================================*/}
                                        <li className="dropdown dropdown-extended dropdown-inbox">
                                            <a href="#/" onClick={this.toggleModalBanker} className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                                <i className={'fa fa-bank'}/>
                                            </a>
                                        </li>
                                        {/*=========================================*/}
                                        <li className="dropdown dropdown-user">
                                            <a className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                                <img className="img-circle" src="/assets/layouts/layout/img/avatar.png" alt="avatar" />
                                                <span className="username username-hide-on-mobile"> {AuthService.getUsername()} </span>
                                                <i className="fa fa-angle-down" />
                                            </a>
                                            <ul className="dropdown-menu dropdown-menu-default">
                                                <Fragment>
                                                    <li>
                                                        {
                                                            isReplaceRouterLink
                                                                ? (
                                                                    <a href={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change Password" />
                                                                    </a>
                                                                )
                                                                : (
                                                                    <Link to={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change Password" />
                                                                    </Link>
                                                                )
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            Number(roles) === 0 ? null :
                                                            isReplaceRouterLink
                                                                ? (
                                                                    <a href={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD_2')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change password 2" />
                                                                    </a>
                                                                )
                                                                : (
                                                                    <Link to={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD_2')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change password 2" />
                                                                    </Link>
                                                                )
                                                        }
                                                    </li>
                                                    <li>
                                                        {
                                                            isReplaceRouterLink
                                                                ? (
                                                                    <a href={RoutesService.getPath('ADMIN', 'CHANGE_SECURE_CODE')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change Secure Code" />
                                                                    </a>
                                                                )
                                                                : (
                                                                    <Link to={RoutesService.getPath('ADMIN', 'CHANGE_SECURE_CODE')}>
                                                                        <i className="icon-lock" /> <TransComponent i18nKey="Change Secure Code" />
                                                                    </Link>
                                                                )
                                                        }
                                                    </li>
                                                </Fragment>
                                                <li>
                                                    {
                                                        isReplaceRouterLink
                                                            ? <a href={RoutesService.getPath('ADMIN', 'AUTH_LOGOUT' )}> <i className="icon-key" /><TransComponent i18nKey="Logout" /></a>
                                                            : <a onClick={this.handleLogout}> <i className="icon-key" /><TransComponent i18nKey="Logout" /></a>
                                                    }
                                                </li>
                                            </ul>
                                        </li>
                                    </> : null
                                }
                                <li className="dropdown dropdown-quick-sidebar-toggler">
                                    {
                                        isReplaceRouterLink
                                            ? <a href={RoutesService.getPath('ADMIN', 'AUTH_LOGOUT' )} className="dropdown-toggle"><i className="icon-logout" /></a>
                                            : <a href="#/" className="dropdown-toggle"  onClick={this.handleLogout}><i className="icon-logout" /></a>
                                    }
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="clearfix"> </div>

                {/* Modal Banker */}
                <Modal isOpen={this.state.isOpenModalBaner} toggle={this.toggleModalBanker} scrollable={true}>
                    <ModalHeader toggle={this.toggleModalBanker} ><i className="icon-social-dribbble" />&nbsp;&nbsp;<span className="caption-subject bold uppercase"><TransComponent i18nKey="Company" /></span></ModalHeader>
                    <ModalBody>
                        <BankerListContainer />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalBanker}><TransComponent i18nKey="Close" /></Button>
                    </ModalFooter>
                </Modal>
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        isReplaceRouterLink: state.AccountantReducer.isReplaceRouterLink || false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: type => dispatch(changeLanguage(type)),
    }
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    withRouter,
)(Header)