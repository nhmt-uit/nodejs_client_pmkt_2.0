import React, { Component, Fragment } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Link, withRouter } from 'react-router-dom';

import { ZopimChat, Notification } from 'my-components/navigation';
import { AuthAction } from 'my-actions/systems';
import BankerListContainer from "my-containers/banker/BankerListContainer";
import { CookieService } from 'my-utils/core';
import { RoutesService } from 'my-routes';
import InfoUserContainer from "my-containers/infoUser/InfoUserContainer";
import 'my-styles/reactstrap-modal.css'
import { changeLanguage } from 'my-actions/systems/LanguageAction';
import { AuthService } from 'my-services/systems';


class Header extends Component {
    handleLogout = async _ => {
        await AuthService.logout()

        this.props.history.push('/auth/login');
    };

    handleChangeLanguage = type => () => {
        CookieService.set('lang', type);

        return this.props.changeLanguage(type);
    };

    render() {
        const isLogin = CookieService.get('isLogin');
        const lang = CookieService.get('lang');
        const { t } = this.props;

        return (
            <div>
                <div className="page-header navbar navbar-fixed-top">
                    <div className="page-header-inner ">
                        <div className="page-logo">
                            <a href="index.html" style={{height: '100%', lineHeight: '50px', color: 'white', fontWeight: 'bold', fontSize: '20px'}}>
                                <span>VW3 Application</span>
                            </a>
                            <div className="menu-toggler sidebar-toggler">
                                <span />
                            </div>

                        </div>
                        <a href="index.html" className="menu-toggler responsive-toggler" data-toggle="collapse" data-target=".navbar-collapse">
                            <span />
                        </a>
                        {/*=========================================*/}
                        <div>
                            <InfoUserContainer/>
                        </div>
                        {/*=========================================*/}
                        <div className="top-menu">
                            <ul className="nav navbar-nav pull-right">
                                <ZopimChat />
                                <Notification />
                                <li className="dropdown dropdown-extended dropdown-inbox" id="header_inbox_bar">
                                    <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                        <i className="icon-globe" />
                                    </a>
                                    <ul className="width-auto dropdown-menu dropdown-menu-default">
                                        <li>
                                            <ul className="dropdown-menu-list scroller" data-handle-color="#637283">
                                                <li>
                                                    <a onClick={this.handleChangeLanguage('en')} className="padding-tb-10-important text-uppercase text-center padding-">
                                                        {(lang && lang.toLowerCase() === 'en') ? <i className="fa fa-check"/> : ''}&nbsp;&nbsp;{t('english')}
                                                    </a>
                                                </li>
                                                <li>
                                                    <a onClick={this.handleChangeLanguage('vi')} className="padding-tb-10-important text-uppercase text-center">
                                                        {(lang && lang.toLowerCase() === 'vi') ? <i className="fa fa-check"/> : ''}&nbsp;&nbsp;{t('viet nam')}
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown dropdown-extended dropdown-inbox" id="header_inbox_bar">
                                    <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                        <i className="icon-envelope-open" />
                                        <span className="badge badge-default"> 4 </span>
                                    </a>
                                    <ul className="dropdown-menu">
                                        <li className="external">
                                            <h3>You have <span className="bold">7 New</span> Messages</h3>
                                            <a href="app_inbox.html">view all</a>
                                        </li>
                                        <li>
                                            <ul className="dropdown-menu-list scroller" style={{ height: 275 }} data-handle-color="#637283">
                                                <li>
                                                    <a href="index.html">
                                                        <span className="photo">
                                                            <img src="/assets/layouts/layout3/img/avatar2.jpg" className="img-circle" alt="avatar" /> </span>
                                                        <span className="subject">
                                                            <span className="from"> Lisa Wong </span>
                                                            <span className="time">Just Now </span>
                                                        </span>
                                                        <span className="message"> Vivamus sed auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="photo">
                                                            <img src="/assets/layouts/layout3/img/avatar3.jpg" className="img-circle" alt="avatar" /> </span>
                                                        <span className="subject">
                                                            <span className="from"> Richard Doe </span>
                                                            <span className="time">16 mins </span>
                                                        </span>
                                                        <span className="message"> Vivamus sed congue nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="photo">
                                                            <img src="/assets/layouts/layout3/img/avatar1.jpg" className="img-circle" alt="avatar" /> </span>
                                                        <span className="subject">
                                                            <span className="from"> Bob Nilson </span>
                                                            <span className="time">2 hrs </span>
                                                        </span>
                                                        <span className="message"> Vivamus sed nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="photo">
                                                            <img src="/assets/layouts/layout3/img/avatar2.jpg" className="img-circle" alt="avatar" /> </span>
                                                        <span className="subject">
                                                            <span className="from"> Lisa Wong </span>
                                                            <span className="time">40 mins </span>
                                                        </span>
                                                        <span className="message"> Vivamus sed auctor 40% nibh congue nibh... </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="photo">
                                                            <img src="/assets/layouts/layout3/img/avatar3.jpg" className="img-circle" alt="avatar" /> </span>
                                                        <span className="subject">
                                                            <span className="from"> Richard Doe </span>
                                                            <span className="time">46 mins </span>
                                                        </span>
                                                        <span className="message"> Vivamus sed congue nibh auctor nibh congue nibh. auctor nibh auctor nibh... </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>

                                {/*=========================================*/}
                                <li className="dropdown dropdown-extended dropdown-inbox">
                                    <MenuCompany/>
                                </li>
                                {/*=========================================*/}

                                <li className="dropdown dropdown-user">
                                    <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                        <img className="img-circle" src="/assets/layouts/layout/img/avatar3_small.jpg" alt="avatar" />
                                        <span className="username username-hide-on-mobile"> Nick </span>
                                        <i className="fa fa-angle-down" />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-default">
                                        {
                                            isLogin
                                                ? (
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
                                                )
                                                : null
                                        }
                                        <li>
                                            <a onClick={this.handleLogout}>
                                                <i className="icon-key" /> {this.props.t('Log Out')} </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown dropdown-quick-sidebar-toggler">
                                    <a href="#/" className="dropdown-toggle">
                                        <i className="icon-logout" />
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="clearfix"> </div>
            </div>
        );
    }
}

class MenuCompany extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            modal: false
        };
        this.toggle = this.toggle.bind(this);
    }

    toggle() {
        this.setState(prevState => ({
            modal: !prevState.modal
        }));
    }
    render() {
        const { t } = this.props;
        return (
            <>
                <a href="#/" onClick={this.toggle} className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className={'fa fa-bank'}/>
                </a>
                <Modal isOpen={this.state.modal} toggle={this.toggle} scrollable={true}>
                    <ModalHeader toggle={this.toggle} ><i class="icon-social-dribbble font-green"></i><span class="caption-subject font-green bold uppercase"> Company </span></ModalHeader>
                    <ModalBody>
                        <BankerListContainer />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}> Close </Button>
                    </ModalFooter>
                </Modal>
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        changeLanguage: type => dispatch(changeLanguage(type)),
    };
};

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps),
    withRouter
)(Header, MenuCompany);