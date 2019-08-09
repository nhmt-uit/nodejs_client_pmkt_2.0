import DashboardPage from 'my-pages/DashboardPage';
import { LoginPage, SecureCodePage, ResetSecurePasswordPage, ResetPage } from 'my-pages/auth';
import { ChangePasswordPage, ChangePassword2Page, ChangeSecureCodePage } from 'my-pages/navigation';

import RoutesService from './RoutesService'
import { AccountantDashboardPage, AccountantListPage, AccountantManualBankerPage, AccountantManualLoginPage, AccountantManualPage } from 'my-pages/accountant';
import { ReportPage, ReportDetailPage } from 'my-pages/report';
import TransactionPage from "my-pages/report/transaction/TransactionPage";
import {
	ManagePage, CreateNewPage,
	SubUserPage, ConfigurationPage,
	AccountPage,
} from 'my-pages/manages';
import { CookieService } from 'my-utils/core';
import { FormulaPage } from 'my-pages/formula';
import FormulaGroupPage from "my-pages/formula-group/FormulaGroupPage";
import { MemberPage } from "my-pages/member";
import { LogoutContainer } from 'my-containers/auth';

import { CurrencyTypePage } from 'my-pages/admin/currency-type';
import { SubStatusPage } from 'my-pages/admin/sub-status';
import { SetFeaturePage } from 'my-pages/admin/set-feature';
import { LogChangePasswordPage } from 'my-pages/admin/log-change-password';

const CommonRoutes = [
	{
		path: "/",
		exact: true,
		component: DashboardPage,
	},
	// authentication
	{
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGOUT'),
		exact: true,
		component: LogoutContainer,
	},
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
		path: RoutesService.getPath('ADMIN', 'AUTH_LOGIN', { type: 'reset' }),
		exact: true,
		component: ResetPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'DASHBOARD'),
		exact: true,
		component: DashboardPage,
	}
];

const Routes = [
	...CommonRoutes,
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_DASHBOARD'),
		exact: true,
		component: AccountantDashboardPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_LIST'),
		exact: true,
		component: AccountantListPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL'),
		exact: true,
		component: AccountantManualBankerPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { type: 'login' }),
		exact: true,
		component: AccountantManualLoginPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_MANUAL_PROCESS', { type: '' }),
		exact: true,
		component: AccountantManualPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'),
		exact: true,
		component: ReportPage,
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
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT_DETAIL'),
		exact: true,
		component: ReportDetailPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT_TRANSACTION'),
		exact: true,
		component: TransactionPage,
	},
	/*
	|--------------------------------------------------------------------------
	| Manage Routes Area
	|--------------------------------------------------------------------------
	*/
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_DASHBOARD'),
		exact: true,
		component: ManagePage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_CREATE_NEW'),
		exact: true,
		component: CreateNewPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_CONFIGURATION'),
		exact: true,
		component: ConfigurationPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_ACCOUNT_SUB'),
		exact: true,
		component: SubUserPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_FORMULA'),
		exact: true,
		component: FormulaPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_FORMULA_GROUP'),
		exact: true,
		component: FormulaGroupPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_MEMBER'),
		exact: true,
		component: MemberPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'MANAGE_ACCOUNT'),
		exact: true,
		component: AccountPage,
	},
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

const RoutesUnActive = [
	...CommonRoutes,
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

const RoutesRoles11_12 = [
	...CommonRoutes,
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_DASHBOARD'),
		exact: true,
		component: AccountantDashboardPage,
	},
	{
		path: RoutesService.getPath('ADMIN', 'ACCOUNTANT_REPORT'),
		exact: true,
		component: ReportPage,
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

const RoutesRoles0 = [
	...CommonRoutes,
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
		path: RoutesService.getPath('ADMIN_MANAGE', 'CURRENCY_TYPE'),
		exact: true,
		component: CurrencyTypePage,
	},
	{
		path: RoutesService.getPath('ADMIN_MANAGE', 'SUB_STATUS'),
		exact: true,
		component: SubStatusPage,
	},
	{
		path: RoutesService.getPath('ADMIN_MANAGE', 'SET_FEATURES'),
		exact: true,
		component: SetFeaturePage,
	},
	{
		path: RoutesService.getPath('ADMIN_MANAGE', 'LOG_CHANGE_PASSWORD'),
		exact: true,
		component: LogChangePasswordPage,
	},
	{
		path: '*',
		exact: true,
		component: DashboardPage,
	},
];

let route;
const status = CookieService.get("status");
const roles = CookieService.get("roles");

if(status === '1' || status === undefined){
	if(roles === '11' || roles === '12'){
		route = RoutesRoles11_12
	} if(roles === '0') {
		route = RoutesRoles0
	} else {
		route = Routes
	}
} else if(status === '0'){
	route = RoutesUnActive
}

export default route;