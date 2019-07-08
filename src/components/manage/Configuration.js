import React, {Component} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { withTranslation } from 'react-i18next';
import { get } from 'lodash';
import { Link } from 'react-router-dom';

import { RoutesService } from 'my-routes';
import { getAccountantConfig } from 'my-actions/manage/ConfiguationAction';

class Configuration extends Component {
    componentDidMount() {

    }

    render() {
        const notification = this.props.notification;
        const count = get(notification, 'msg.acc', 0);

        return (
            <li className="dropdown dropdown-extended dropdown-notification" id="header_notification_bar">
                <a href="index.html" className="dropdown-toggle" data-toggle="dropdown" data-hover="dropdown" data-close-others="true">
                    <i className="icon-bell" />
                    <span className="badge badge-default"> {count + get(notification, 'msg.rs', []).length > 0 ? 1 : 0} </span>
                </a>
                <ul className="dropdown-menu">
                    <li className="external">
                        <h3>
                            <span className="label label-sm label-icon label-warning">
                                <i className="fa fa-bell-o" />
                            </span>&nbsp;&nbsp;
                            <span className="bold">{
                                count + get(notification, 'msg.rs', []).length > 0 ? 1 : 0
                            } notifications</span>
                        </h3>
                    </li>
                    <li>
                        <ul className="dropdown-menu-list scroller" style={{ height: 250 }} data-handle-color="#637283">
                            {
                                count > 0
                                    ? (
                                        <li>
                                            <Link to={RoutesService.getPath('ADMIN', 'ACCOUNT')}>
                                                <span className="details">
                                                {this.props.t(`Have ${count} sub account need to be updated`)}</span>
                                            </Link>
                                        </li>
                                    )
                                    : <div />
                            }
                        </ul>
                    </li>
                </ul>
            </li>
        );
    }
}

const mapStateToProps = state => {
    return {
        notification: state.NotificationReducer,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getAccountantConfig: () => dispatch(getAccountantConfig()),
        //getCompanyConfig: () => dispatch(getCompanyConfig()),
    };
};

export default compose(
    withTranslation(),
    connect(mapStateToProps, mapDispatchToProps),
)(Configuration);