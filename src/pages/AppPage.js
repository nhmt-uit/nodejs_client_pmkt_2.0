import React from 'react';
import { connect } from 'react-redux';

import { BaseComponent } from "my-utils/core"
import { MainLayout, AuthenticationLayout } from 'my-pages/layouts'
import { Loading } from 'my-pages/layouts/partials';
import { CookieService } from 'my-utils/core';
import { changeLanguage } from 'my-actions/systems/LanguageAction';

const RenderComponent = () => {
	let component = ( <MainLayout /> );

	// Check user is login? change template
	const isLogin = CookieService.get("isLogin");
	const isCheckSecure = CookieService.get('isCheckSecure');
	const byPassDashboard = CookieService.get('byPassDashboard');

	if ((!isLogin || !isCheckSecure !== undefined) && !byPassDashboard) {
		component = ( <AuthenticationLayout /> );
	}
	
	return component;
};

class AppPage extends BaseComponent {
	componentDidMount() {
		// this.props.changeLanguage();
	}

	render() {
		return (
			<section>
				<RenderComponent />
				<Loading />
			</section>
		);
	}
}

const mapStateToProps = state => ({
    auth : state.AuthReducer
});

const mapDispatchToProps = dispatch => {
	return {
		changeLanguage: _ => dispatch(changeLanguage()),
	};
};

export default connect(mapStateToProps,mapDispatchToProps)(AppPage);