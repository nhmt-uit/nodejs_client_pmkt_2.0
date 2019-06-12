import DashboardPage from 'my-pages/DashboardPage';
import LoginPage from 'my-pages/auth/LoginPage';
import SecureCodePage from 'my-pages/auth/SecureCodePage';

import { AccountantListPage } from 'my-pages/accountant';
import RoutesService from './RoutesService'

const Routes = [
	{
		path: "/",
		exact: true,
		component: DashboardPage,
	},
	// authentication
	{
		path: RoutesService.getPath('ADMIN', 'SECURE_CODE'),
		exact: true,
		component: SecureCodePage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGIN'),
		exact: true,
		component: LoginPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'DASHBOARD'),
		exact: true,
		component: DashboardPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_LIST'),
		exact: true,
		component: AccountantListPage,
	},
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

export default Routes;