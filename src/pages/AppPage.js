import React from 'react';
import { connect } from 'react-redux';


import { BaseComponent } from "my-utils/core"
import { AppConfig } from "my-constants"
import { MainLayout, AuthenticationLayout } from 'my-pages/layouts'
import { Loading } from 'my-pages/layouts/partials';
import { FlashMessagesContainer } from 'my-containers/systems';
import { CookieService } from 'my-utils/core';
import { changeLanguage } from 'my-actions/systems/LanguageAction';
import { RoutesService } from 'my-routes'

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
	constructor(props) {
		super(props)
		this.props.changeLanguage(AppConfig.DEFAULT_LANG);

		CookieService.addChangeListener(obj => {
			if ((obj.name === "isLogin"  && !obj.value) || (obj.name === "byPassDashboard" && obj.value) ) this.forceUpdate()
		})
		const isLogin = CookieService.get("isLogin");
		const pathname = window.location.pathname;
		if(!isLogin && !pathname.match(/\/auth\/login/i)) window.location.href = RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' })
	}

	render() {
		const isLogin = CookieService.get("isLogin");
		const pathname = window.location.pathname;
		if(!isLogin && !pathname.match(/\/auth\/login/i)) return null
		return (
			<>
				<RenderComponent />
				<Loading />
				<FlashMessagesContainer />
			</>
		);
	}
}


const mapDispatchToProps = dispatch => {
	return {
		changeLanguage: lang_code => dispatch(changeLanguage(lang_code)),
	};
};

export default connect(null, mapDispatchToProps)(AppPage);