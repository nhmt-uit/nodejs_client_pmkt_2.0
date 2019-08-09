import React, {Component} from 'react';
import { connect } from 'react-redux';
import ReactDOM from 'react-dom';

import { TransComponent, LoadingComponent } from 'my-components';
import { getUsers, clearUsers } from 'my-actions/user/UserAction';
import { UserItemContainer } from 'my-containers/admin/set-feature';

class ListUserContainer extends Component {
    componentDidMount() {
        this.props.getUsers();
    }

    componentWillUnmount() {
        this.props.clearUsers();
    }

    renderBody() {
        const lstUser = this.props.lstUser;

        return lstUser.map(user => <UserItemContainer key={user.id} user={user} />);
    }

    render() {
        return (
            <div className="table-responsive position-relative min-height-60">
                { this.props.isFetchingUser ? <LoadingComponent /> : null }
                <table className="table table-hover table-formula">
                    <thead className="font-red-sunglo">
                    <tr>
                        <th><TransComponent i18nKey="Users" /></th>
                        <th><TransComponent i18nKey='Export To CSV' /></th>
                        <th><TransComponent i18nKey="Report detail" /></th>
                    </tr>
                    </thead>
                    <tbody>
                        { this.renderBody() }
                    </tbody>
                </table>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        lstUser: state.UserReducer.lstUser || [],
        isFetchingUser: state.UserReducer.isFetchingUser || false,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getUsers: () => dispatch(getUsers()),
        clearUsers: () => dispatch(clearUsers()),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ListUserContainer);