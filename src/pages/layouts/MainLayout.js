import React, { Component } from 'react';
import {connect} from "react-redux";
import { BrowserRouter as Router } from "react-router-dom";
import { isEqual as _isEqual } from 'lodash'

import { Header, MainNavigation, Footer } from 'my-pages/layouts/partials';
import RenderRoutes from 'my-routes/RenderRoutes';

class MainLayout extends Component {
	shouldComponentUpdate(newProps, newState) {
        if(!_isEqual(newProps.isFullScreen, this.props.isFullScreen))
            return true
        return false;
    }
    render() {
        return (
			<Router>
				<div className={this.props.isFullScreen ? "page-header-fixed page-sidebar-closed-hide-logo page-content-white full-screen" :  "page-header-fixed page-sidebar-closed-hide-logo page-content-white" }>
					<div className="page-wrapper">
						<Header />
						<div className="page-container">
							<MainNavigation />
							<div className="page-content-wrapper">
								<div className="page-content">
									<RenderRoutes />
								</div>
							</div>
						</div>
						<Footer />
					</div>
				</div>
			</Router>
        )
    }
}

const mapStateToProps = state => {
	return {
		isFullScreen : state.AppReducer.isFullScreen,
	};
};

export default connect(mapStateToProps, null)(MainLayout);
