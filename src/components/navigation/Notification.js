import React, {Component} from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { get } from 'lodash';
import { Link } from 'react-router-dom';
import { isEqual as _isEqual } from 'lodash'

import { RoutesService } from 'my-routes';
import { getMsg, getFriend } from 'my-actions/systems/NotificationAction';
import { TransComponent } from 'my-components'

class Notification extends Component {
    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.notification, this.props.notification))
            return true
        return false;
    }

    componentDidMount() {
        this.props.getMsg();
        this.props.getFriend();
    }

    render() {
        console.log("redner")
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
                                                    <TransComponent i18nKey={`Have ${count} sub account need to be updated`} />
                                                </span>
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
        getMsg: () => dispatch(getMsg()),
        getFriend: () => dispatch(getFriend()),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
)(Notification);