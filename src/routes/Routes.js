import DashboardPage from 'my-pages/DashboardPage';
import { LoginPage, SecureCodePage, ResetSecurePasswordPage } from 'my-pages/auth';
import { ChangePasswordPage, ChangePassword2Page, ChangeSecureCodePage } from 'my-pages/navigation';

import { AccountantListPage, AccountantManualPage } from 'my-pages/accountant';
import RoutesService from './RoutesService'

const Routes = [
	{
		path: "/",
		exact: true,
		component: DashboardPage,
	},
	// authentication
	{
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'login' }),
		exact: true,
		component: LoginPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'secure' }),
		exact: true,
		component: SecureCodePage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset-secure-password' }),
		exact: true,
		component: ResetSecurePasswordPage,
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
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL'),
		exact: true,
		component: AccountantManualPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD'),
		exact: true,
		component: ChangePasswordPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD_2'),
		exact: true,
		component: ChangePassword2Page,
	},
	{
		path: RoutesService.getPath('ADMIN', 'CHANGE_SECURE_CODE'),
		exact: true,
		component: ChangeSecureCodePage,
	},
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

export default Routes;