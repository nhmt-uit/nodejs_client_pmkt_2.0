import DashboardPage from 'my-pages/DashboardPage';
import { LoginPage, SecureCodePage, ResetSecurePasswordPage } from 'my-pages/auth';
import { ChangePasswordPage } from 'my-pages/navigation';

import { AccountantListPage } from 'my-pages/accountant';
import { ManagePage, CreateNewPage, ConfigurationPage } from 'my-pages/manage';
import RoutesService from './RoutesService'
import { AccountantListPage, AccountantManualPage } from 'my-pages/accountant';
import { ReportPage, ReportDetailPage } from 'my-pages/report';
import TransactionPage from "my-pages/report/transaction/TransactionPage";

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
		path: RoutesService.getPath('ADMIN', 'CHANGE_PASSWORD'),
		exact: true,
		component: ChangePasswordPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_DASHBOARD'),
		exact: true,
		component: ManagePage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'CREATE_NEW'),
		exact: true,
		component: CreateNewPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'CONFIGURATION'),
		exact: true,
		component: ConfigurationPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT_TRANSACTION'),
		exact: true,
		component: TransactionPage,
	},
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

export default Routes;