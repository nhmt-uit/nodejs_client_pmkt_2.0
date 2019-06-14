import React from 'react';
import Cookies from 'universal-cookie';
import { connect } from 'react-redux';

import { BaseComponent } from "my-utils/core"
import { MainLayout, AuthenticationLayout } from 'my-pages/layouts'
import { Loading } from 'my-pages/layouts/partials';


const cookies = new Cookies();

const RenderComponent = () => {
	let component = ( <MainLayout /> );

	// Check user is login? change template
	const isLogin = cookies.get("isLogin");
	const isCheckSecure = cookies.get('isCheckSecure');
	const byPassDashboard = cookies.get('byPassDashboard');

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