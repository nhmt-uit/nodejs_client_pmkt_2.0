import React, { Component } from 'react'
import { connect } from 'react-redux'
import { isEqual as _isEqual } from 'lodash'

import { toggleFullScreen } from 'my-actions/systems/AppAction';
import { TransComponent } from 'my-components'

class AccountantFormButtonFullScreenContainer extends Component {

    shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.isFullScreen, this.props.isFullScreen))
            return true
        return false;
    }

    render() {
        return (
            <a className="btn btn-default btn-fullscreen" href="#/" onClick={_ => this.props.toggleFullScreen() }>
                <i className={this.props.isFullScreen ? "fa fa-compress" : "fa fa-expand"} />
                {this.props.isFullScreen ? <TransComponent i18nKey="Exit Full Screen" /> : <TransComponent i18nKey="Full Screen" />}
            </a>
        )
    }
}

const mapStateToProps = state => {
    return {
        isFullScreen : state.AppReducer.isFullScreen
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        toggleFullScreen: _ => {dispatch(toggleFullScreen())},
    }
};


export default connect(mapStateToProps, mapDispatchToProps)(AccountantFormButtonFullScreenContainer);

