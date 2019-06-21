import React, { Component, Fragment } from 'react'
import { withTranslation } from 'react-i18next'
import { connect } from 'react-redux'
import { compose } from 'redux'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap'
import { Link } from 'react-router-dom'

import { ZopimChat, Notification } from 'my-components/navigation'
import { AuthAction } from 'my-actions/systems'
import BankerListContainer from "my-containers/banker/BankerListContainer"
import { CookieService } from 'my-utils/core'
import { RoutesService } from 'my-routes'
import InfoUserContainer from "my-containers/infoUser/InfoUserContainer"
import 'my-styles/reactstrap-modal.css'
import { changeLanguage } from 'my-actions/systems/LanguageAction'
import { AuthService } from 'my-services/systems'


class Header extends Component {
    state = {
        isOpenModalBaner: false
    }

    handleLogout = async _ => {
        await AuthService.logout()
        window.location.reload()
    }

    handleChangeLanguage = type => () => {
        CookieService.set('lang', type)
        return this.props.changeLanguage(type)
    }

    toggleModalBanker = _ => {
        this.setState({ isOpenModalBaner: !this.state.isOpenModalBaner })
    }

    render() {
        const lang = CookieService.get('lang')
        const { t } = this.props

        return (
            <div>
                <div className="page-header navbar navbar-fixed-top">
                    <div className="page-header-inner ">
                        <div className="page-logo">
                            <Link to={RoutesService.getPath('ADMIN', 'DASHBOARD')} style={{height: '100%', lineHeight: '50px', color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                                <span>VW3 Application</span>
                            </Link>
                            <div className="menu-toggler sidebar-toggler"><span /></div>
                        </div>
                        <Link to={RoutesService.getPath('ADMIN', 'DASHBOARD')} className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse" />
                        {/*=========================================*/}
                        <div>
                            <InfoUserContainer/>
                        </div>
                        {/*=========================================*/}
                        <div className="top-menu">
                            <ul className="nav navbar-nav pull-right">
                                <li className="dropdown dropdown-user">
                                    <a href="/assets/images/HDSD PMKT VERSION 3.3.pdf" className="dropdown-toggle" target="_bank">
                                        <span className="username"> {t("document for new features")} </span>
                                        
                                    </a>
                                </li>
                                <ZopimChat />
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
                                                        {(lang && lang.toLowerCase() === 'en') ? <i className="fa fa-check"/> : ''}&nbsp&nbsp{t('english')}
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={this.handleChangeLanguage('vi')} className="padding-tb-10-important text-uppercase text-center">
                                                        {(lang && lang.toLowerCase() === 'vi') ? <i className="fa fa-check"/> : ''}&nbsp&nbsp{t('viet nam')}
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
                                                <Link to={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD')}>
                                                    <i className="icon-lock" /> {t('Change Password')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD_2')}>
                                                    <i className="icon-lock" /> {t('Change password 2')}
                                                </Link>
                                            </li>
                                            <li>
                                                <Link to={RoutesService.getPath('ADMIN', 'CHANGE_SECURE_CODE')}>
                                                    <i className="icon-lock" /> {t('Change Secure Code')}
                                                </Link>
                                            </li>
                                        </Fragment>
                                        <li>
                                            <a onClick={this.handleLogout}> <i className="icon-key" /> {this.props.t('Log Out')} </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown dropdown-quick-sidebar-toggler">
                                    <a href="#/" className="dropdown-toggle"  onClick={this.handleLogout}><i className="icon-logout" /></a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="clearfix"> </div>

                {/* Modal Banker */}
                <Modal isOpen={this.state.isOpenModalBaner} toggle={this.toggleModalBanker} scrollable={true}>
                    <ModalHeader toggle={this.toggleModalBanker} ><i class="icon-social-dribbble font-green"></i><span class="caption-subject font-green bold uppercase"> {t("Company")}</span></ModalHeader>
                    <ModalBody>
                        <BankerListContainer />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggleModalBanker}> {t("Close")}</Button>
                    </ModalFooter>
                </Modal>
            </div>
        )
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: type => dispatch(changeLanguage(type)),
    }
}

export default compose(
    connect(null, mapDispatchToProps),
    withTranslation()
)(Header)