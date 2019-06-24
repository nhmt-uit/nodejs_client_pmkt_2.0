import React from 'react';
import { connect } from 'react-redux';


import { BaseComponent } from "my-utils/core"
import { AppConfig } from "my-constants"
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
<<<<<<< HEAD
	componentDidMount() {
		// this.props.changeLanguage();
=======
	constructor(props) {
		super(props)
		this.props.changeLanguage(AppConfig.DEFAULT_LANG);

		CookieService.addChangeListener(obj => {
			if ((obj.name === "isLogin"  && !obj.value) || (obj.name === "byPassDashboard" && obj.value) ) this.forceUpdate()
		})
>>>>>>> 813c1aab6b63e728cd5efbdf71fdbe812825a91a
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


const mapDispatchToProps = dispatch => {
	return {
		changeLanguage: lang_code => dispatch(changeLanguage(lang_code)),
	};
};

export default connect(null, mapDispatchToProps)(AppPage);