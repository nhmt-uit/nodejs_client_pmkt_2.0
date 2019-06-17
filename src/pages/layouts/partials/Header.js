import React, { Component } from 'react';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { ZopimChat, Notification } from 'my-components/navigation';
import { AuthAction } from 'my-actions/systems';
import BankerListContainer from "my-containers/banker/BankerListContainer";
import { Button, Modal, ModalBody, ModalFooter } from 'reactstrap';
import 'my-styles/reactstrap-modal.css'

class Header extends Component {
    handleLogout() {
        return this.props.logout();
    }

    render() {
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
                        <div className="top-menu">
                            <ul className="nav navbar-nav pull-right">
                                <ZopimChat label="Live support" className="text-red" />
                                <Notification />
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
                                <li className="dropdown dropdown-extended dropdown-tasks" id="header_task_bar">
                                    <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                        <i className="icon-calendar" />
                                        <span className="badge badge-default"> 3 </span>
                                    </a>
                                    <ul className="dropdown-menu extended tasks">
                                        <li>
                                            <h3>You have <span className="bold">12 pending</span> tasks</h3>
                                            <a href="app_todo.html">view all</a>
                                        </li>
                                        <li className="external">
                                            <h3>You have <span className="bold">12 pending</span> tasks</h3>
                                            <a href="app_todo.html">view all</a>
                                        </li>
                                        <li>
                                            <ul className="dropdown-menu-list scroller" style={{ height: 275 }} data-handle-color="#637283">
                                                <li>
                                                    <a href="index.html">
                                                        <span className="task">
                                                            <span className="desc">New release v1.2 </span>
                                                            <span className="percent">30%</span>
                                                        </span>
                                                        <span className="progress">
                                                            <span style={{ width: '40%' }} className="progress-bar progress-bar-success" aria-valuenow={40} aria-valuemin={0} aria-valuemax={100}>
                                                                <span className="sr-only">40% Complete</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="task">
                                                            <span className="desc">Application deployment</span>
                                                            <span className="percent">65%</span>
                                                        </span>
                                                        <span className="progress">
                                                            <span style={{ width: '65%' }} className="progress-bar progress-bar-danger" aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>
                                                                <span className="sr-only">65% Complete</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="task">
                                                            <span className="desc">Mobile app release</span>
                                                            <span className="percent">98%</span>
                                                        </span>
                                                        <span className="progress">
                                                            <span style={{ width: '98%' }} className="progress-bar progress-bar-success" aria-valuenow={98} aria-valuemin={0} aria-valuemax={100}>
                                                                <span className="sr-only">98% Complete</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="index.html">
                                                        <span className="task">
                                                            <span className="desc">Database migration</span>
                                                            <span className="percent">10%</span>
                                                        </span>
                                                        <span className="progress">
                                                            <span style={{ width: '10%' }} className="progress-bar progress-bar-warning" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                                                <span className="sr-only">10% Complete</span>
                                                            </span>
                                                        </span>
                                                    </a>
                                                </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">Application deployment</span>
                                                        <span className="percent">65%</span>
                                                    </span>
                                                    <span className="progress">
                                                        <span style={{ width: '65%' }} className="progress-bar progress-bar-danger" aria-valuenow={65} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">65% Complete</span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">Mobile app release</span>
                                                        <span className="percent">98%</span>
                                                    </span>
                                                    <span className="progress">
                                                        <span style={{ width: '98%' }} className="progress-bar progress-bar-success" aria-valuenow={98} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">98% Complete</span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">Database migration</span>
                                                        <span className="percent">10%</span>
                                                    </span>
                                                    <span className="progress">
                                                        <span style={{ width: '10%' }} className="progress-bar progress-bar-warning" aria-valuenow={10} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">10% Complete</span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">Web server upgrade</span>
                                                        <span className="percent">58%</span>
                                                    </span>
                                                    <span className="progress">
                                                        <span style={{ width: '58%' }} className="progress-bar progress-bar-info" aria-valuenow={58} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">58% Complete</span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">Mobile development</span>
                                                        <span className="percent">85%</span>
                                                    </span>
                                                    <span className="progress">
                                                        <span style={{ width: '85%' }} className="progress-bar progress-bar-success" aria-valuenow={85} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">85% Complete</span>
                                                        </span>
                                                    </span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="index.html">
                                                    <span className="task">
                                                        <span className="desc">New UI release</span>
                                                        <span className="percent">38%</span>
                                                    </span>
                                                    <span className="progress progress-striped">
                                                        <span style={{ width: '38%' }} className="progress-bar progress-bar-important" aria-valuenow={18} aria-valuemin={0} aria-valuemax={100}>
                                                            <span className="sr-only">38% Complete</span>
                                                        </span>
                                                    </span>
                                                    </a>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown dropdown-user">
                                    <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                                        <img className="img-circle" src="/assets/layouts/layout/img/avatar3_small.jpg" alt="avatar" />
                                        <span className="username username-hide-on-mobile"> Nick </span>
                                        <i className="fa fa-angle-down" />
                                    </a>
                                    <ul className="dropdown-menu dropdown-menu-default">
                                        <li>
                                            <a href="page_user_profile_1.html">
                                                <i className="icon-user" /> My Profile </a>
                                        </li>
                                        <li>
                                            <a href="app_calendar.html">
                                                <i className="icon-calendar" /> My Calendar </a>
                                        </li>
                                        <li>
                                            <a href="app_inbox.html">
                                                <i className="icon-envelope-open" /> My Inbox
                                                <span className="badge badge-danger"> 3 </span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="app_todo.html">
                                                <i className="icon-rocket" /> My Tasks
                                                <span className="badge badge-success"> 7 </span>
                                            </a>
                                        </li>
                                        <li className="divider"> </li>
                                        <li>
                                            <a href="page_user_lock_1.html">
                                                <i className="icon-lock" /> Lock Screen </a>
                                        </li>
                                        <li>
                                            <a onClick={this.handleLogout.bind(this)}>
                                                <i className="icon-key" /> {this.props.t('Log Out')} </a>
                                        </li>
                                    </ul>
                                </li>
                                <li className="dropdown dropdown-quick-sidebar-toggler">
                                    <a href="#" className="dropdown-toggle">
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
        return (
            <>
                <a onClick={this.toggle} className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className={'fa fa-bank'}/>
                </a>
                <Modal isOpen={this.state.modal}>
                    <ModalBody>
                        <BankerListContainer />
                    </ModalBody>
                    <ModalFooter>
                        <Button color="secondary" onClick={this.toggle}>Close</Button>
                    </ModalFooter>
                </Modal>
                {/*<button type="button" className="btn btn-primary" data-toggle="modal" data-target="#exampleModal">*/}
                    {/*<i className={'fa fa-bank'}/>*/}
                {/*</button>*/}
                {/*<div className="modal fade" id="exampleModal" tabIndex="-1" role="dialog"*/}
                     {/*aria-labelledby="exampleModalLabel" aria-hidden="true">*/}
                    {/*<div className="modal-dialog" role="document">*/}
                        {/*<div className="modal-content">*/}
                            {/*<div className="modal-body">*/}
                                {/*<BankerListContainer />*/}
                            {/*</div>*/}
                            {/*<div className="modal-footer">*/}
                                {/*<button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>*/}
                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
            </>
        );
    }
}

const mapDispatchToProps = dispatch => {
    return {
        logout: () => dispatch(AuthAction.logout())
    };
};

export default compose(
    withTranslation(),
    connect(null, mapDispatchToProps),
)(Header);