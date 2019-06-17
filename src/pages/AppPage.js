import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

import { BaseComponent } from "my-utils/core"
import { MainLayout, AuthenticationLayout } from 'my-pages/layouts'
import { Loading } from 'my-pages/layouts/partials';
import { CookieService } from 'my-utils/core';

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

export default connect(mapStateToProps,null)(AppPage);